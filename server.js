const { broker } = require('./connection/mqttSub');
const { io } = require('./connection/socket');
const { getMesin, getUser, postHistory, updateUser } = require('./model/user');
const { log_mesin, UPDATE_mesin, UPDATE_mesin_status, UPDATE_mesin_vaule } = require('./model/mesin');

broker.on('message', async function (topic, message){
    // console.log(topic, message.toString())
    let date_ob = new Date();
    if (topic == 'mesin/status/online' ){
        console.log(message.toString() + " is online");
        // let date_ob = new Date();
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
        // let date_ob = new Date();
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
            console.log("clientid: " + data.clientid)
            console.log("Wifi: " + data.Wifi)
            console.log("IP: " + data.IP)
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
            await con.beginTransaction();
            console.log("running query...");
            await updateUser(id_user, newDebit, newKredit, date_ob);
            await postHistory(id_user, id_mesin, lokasi, nama, vaule, HargaTotal, date_ob);
            await con.commit();
            console.log("transaction committed.");
        } catch (err) {
            console.error(err)
        }
    }
});

