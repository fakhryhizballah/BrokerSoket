const { broker } = require('./connection/mqttSub');
const { io } = require('./connection/socket');
const { getMesin, getUser, postHistory, updateUser } = require('./model/user');
const { log_mesin, UPDATE_mesin, UPDATE_mesin_status, UPDATE_mesin_vaule } = require('./model/mesin');
const { getSaldoCard, getRFIDMesin, updateSaldoCard, postHistoryCard } = require('./model/rfid');

broker.on('message', async (topic, message) => {
    // console.log(topic, message.toString())
    let date_ob = new Date();
    if (topic == 'mesin/status/online' ){
        console.log(message.toString() + " is online");
        var id = (message.toString())
        const pesan = {
            message: "ID : " + id + " Online",
            grup: "log spairum"
        };
        const dataMessage = JSON.stringify(pesan).toString();
        broker.publish('sendGrup', dataMessage)
        log_mesin(id, "Online", date_ob);
        UPDATE_mesin_status("Online", date_ob, id);
    }
    if (topic == 'mesin/status/offline' ){
        console.log(message.toString() + " is offline");
        var id = (message.toString())
        const pesan = {
            message: "ID : " + id + " Offline",
            grup: "log spairum"
        };
        const dataMessage = JSON.stringify(pesan).toString();
        broker.publish('sendGrup', dataMessage)
        log_mesin(id, "Offline", date_ob);
        UPDATE_mesin_status("Offline", date_ob, id);

        io.emit("mesin/status/offline", message.toString());
    }
    if (topic == 'mesin/status/rssi') {
        const pesan = message.toString()
        console.log(pesan);
        io.emit("mesin/status", message.toString());
        try{
            const data = JSON.parse(pesan)
            console.log("clientid: " + data.clientid)
            console.log("RSSI: " + data.RSSI)
            console.log("vaule: " + data.vaule)
            UPDATE_mesin_vaule(data.vaule, date_ob, data.clientid);
        }catch (err){
            console.log(err)
        }
        // console.log(message.toString() + " is rssi");
    }
    if (topic == 'mesin/data/log') {
        const pesan = message.toString()
        console.log(pesan);
        try {
            const data = JSON.parse(pesan)
            // console.log("clientid: " + data.clientid)
            // console.log("Wifi: " + data.Wifi)
            // console.log("IP: " + data.IP)
            log_mesin(data.clientid, "Wifi: " + data.Wifi + " | " + "IP: " + data.IP, date_ob);
        } catch (err) {
            console.log(err)
        }
    }
    if (topic == 'mesin/data/log/pintu') {
        const pesan = message.toString()
        console.log(pesan);
        try {
            const data = JSON.parse(pesan)
            console.log("clientid: " + data.clientid)
            console.log("OPEN DOR: ")
            console.log("date: " + date_ob)
            log_mesin(data.clientid, "OPEN DOR ", date_ob);
        } catch (err) {
            console.log(err)
        }
    }
    if (topic == 'current') {
        try {
            const data = JSON.parse(message)
            console.log('json current');
            var user = data.user
            console.log(user);
            io.emit("current/" + user, data);
        } catch (err) {
            console.error(err)
        }
    }
    if (topic == 'nodeTrans') {

        let id_mesin, mesinID, id_user, HargaTotal, nama, vaule;
        try {
            let date_ob = new Date();
            const data = JSON.parse(message)
            id_mesin = data.id
            mesinID = data.mesinID
            id_user = data.akun
            HargaTotal = parseInt(data.HargaTotal)
            nama = data.nama
            vaule = data.vaule
            let mesin = await getMesin(mesinID);
            let lokasi = mesin['lokasi'];
            let user = await getUser(id_user);
            let debit = parseInt(user['debit']);
            let kredit = parseInt(user['kredit']);
            let newDebit = debit - HargaTotal;
            let newKredit = kredit + HargaTotal;
            // await con.beginTransaction();
            console.log("running query...");
            await updateUser(id_user, newDebit, newKredit, date_ob);
            await postHistory(id_user, id_mesin, lokasi, nama, vaule, HargaTotal, date_ob);
            // await con.commit();
            console.log("transaction committed.");
        } catch (err) {
            console.error(err)
        }
    }
    const uid = topic.split('/')[1]
    if (uid == 'uid') {
        let id_mesin = topic.split('/')[2]
        let data = message.toString()
        console.log("UID CARD:" + data);
        let saldo_card = await getSaldoCard(data)
        let mesin = await getRFIDMesin(id_mesin);
        let debit;
        try {
            let harga_mesin = mesin.harga;
            console.log(mesin);
        } catch (err) {
            broker.publish('mesin/rejection/' + id_mesin, "Maaf Mesin Tidak Terdaftar")
            console.log("mesin not found");
            return;
        }
        try {
            debit = parseInt(saldo_card.debit);
        } catch (error) {
            broker.publish('mesin/rejection/' + id_mesin, "Maaf Kartu Anda Tidak Terdaftar", { qos: 2 })
            broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
            broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
            broker.publish('mesin/RFID/LCD1' + id_mesin, "Maaf Kartu Anda")
            broker.publish('mesin/RFID/LCD2' + id_mesin, "Tidak Terdaftar")
            console.log("Maaf Kartu Anda Tidak Terdaftar");
            return;
        }
        if (mesin.harga == 0) {
            console.log("gratis");
            console.log("Debit: " + debit);
            let pesan = {
                ID_USER: data,
                MAX_ML: 1000,
                FAKTOR_POMPA: mesin.faktor
            }
            broker.publish('mesin/fill/' + id_mesin, JSON.stringify(pesan).toString(), { qos: 2 });
            broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
            broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
            broker.publish('mesin/RFID/LCD1' + id_mesin, "Sedang Mengisi . . .")
            broker.publish('mesin/RFID/LCD2' + id_mesin, "TAP CARD TO STOP")
            return;
        }
        let hagraPer = parseInt(debit) / parseInt(mesin.harga);
        let maxml = parseInt(hagraPer * 100);
        if (hagraPer >= 1) {
            console.log("debit cukup");
            if (hagraPer > 10) {
                let pesan = {
                    ID_USER: data,
                    MAX_ML: 1000,
                    FAKTOR_POMPA: mesin.faktor
                }
                broker.publish('mesin/fill/' + id_mesin, JSON.stringify(pesan).toString(), { qos: 2 });
                broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
                broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
                broker.publish('mesin/RFID/LCD1' + id_mesin, "Sedang Mengisi . . .")
                broker.publish('mesin/RFID/LCD2' + id_mesin, "TAP CARD TO STOP")
                return;
            } else {
                let pesan = {
                    ID_USER: data,
                    MAX_ML: maxml,
                    FAKTOR_POMPA: mesin.faktor
                }
                broker.publish('mesin/fill/' + id_mesin, JSON.stringify(pesan).toString(), { qos: 2 });
                broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
                broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
                broker.publish('mesin/RFID/LCD1' + id_mesin, "Sedang Mengisi . . .")
                broker.publish('mesin/RFID/LCD2' + id_mesin, "TAP CARD TO STOP")
                return;
            }
        }
        console.log(mesin);
        console.log(saldo_card);
        broker.publish('mesin/rejection/' + id_mesin, "Maaf Saldo Kartu Anda Tidak Mencukupi", { qos: 2 })
        broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
        broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
        broker.publish('mesin/RFID/LCD1/' + id_mesin, "Maaf Saldo Kartu")
        broker.publish('mesin/RFID/LCD2/' + id_mesin, "Anda Tidak Mencukupi")
    }
    if (uid == 'endRefill') {
        let date_ob = new Date();
        let data
        let harga_mesin
        let id_mesin
        let saldo_card
        try {
            id_mesin = topic.split('/')[2]
            data = JSON.parse(message);
            let mesin = await getRFIDMesin(id_mesin);
            harga_mesin = mesin.harga;
            saldo_card = await getSaldoCard(data.ID_USER)
        } catch (err) {
            console.log("mesin not found error");
            return;
        }
        let harga_total = parseInt(data.vaule * harga_mesin / 100);
        let debit = parseInt(saldo_card.debit - harga_total);
        updateSaldoCard(debit, data.ID_USER);
        postHistoryCard(data.ID_USER, id_mesin, data.vaule, harga_total, date_ob);
        broker.publish('mesin/RFID/LCD1' + id_mesin, "                ", { qos: 2 })
        broker.publish('mesin/RFID/LCD2' + id_mesin, "                ", { qos: 2 })
        broker.publish('mesin/RFID/LCD1/' + id_mesin, "Terima Kasih")
        broker.publish('mesin/RFID/LCD2/' + id_mesin, "silahkan ambil air")
    }
});

