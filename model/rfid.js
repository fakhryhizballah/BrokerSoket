const { con } = require('../connection/mysql');

const getSaldoCard = async function (uid) {
    var sql = `SELECT saldo_card.debit FROM	saldo_card WHERE saldo_card.uid = ?`;
    return new Promise((resolve, reject) => {
        con.query(sql, [uid], (error, results) => {
            if (error) {
                return reject(error);
            }
            try {
                var resultArray = Object.values(JSON.parse(JSON.stringify(results)))
                // return resolve(results);
                return resolve(resultArray[0]);
            }
            catch (err) {
                return resolve();
            }

        });
    });
};
const getRFIDMesin = function (id_mesin) {
    // var sql = `SELECT * FROM mesin_rfid WHERE id_mesin = ?`;
    var sql = `SELECT * FROM new_mesin WHERE id_mesin = ?`;
    // con.query(sql, [id_mesin], function (err, result) {
    //     if (err) throw err;
    //     result = Object.values(JSON.parse(JSON.stringify(result)));
    //     console.log(result[0]);
    //     return result[0];
    // });
    return new Promise((resolve, reject) => {
        con.query(sql, [id_mesin], (error, results) => {
            if (error) {
                return reject(error);
            }
            try {
                var resultArray = Object.values(JSON.parse(JSON.stringify(results)))
                // return resolve(results);
                return resolve(resultArray[0]);
            }
            catch (err) {
                return resolve();
            }

        });
    });
};
const updateSaldoCard = async function (debit, uid) {
    var sql = `UPDATE saldo_card SET debit=?  WHERE uid = ?`;
    con.query(sql, [debit, uid], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + "record(s) updateSaldoCard updated");
    });
};
const postHistoryCard = async function (uid, id_mesin, vaule, harga, date_ob) {
    var sql = `INSERT INTO history_card SET uid= ?, id_mesin= ?, vaule= ?, harga= ?, updated_at= ?,created_at =?`;
    con.query(sql, [uid, id_mesin, vaule, harga, date_ob, date_ob], function (err, result) {
        if (err) throw err;
        console.log("postHistoryCard records inserted: " + result.affectedRows);
    });
}
module.exports = {
    getSaldoCard,
    getRFIDMesin,
    updateSaldoCard,
    postHistoryCard
}