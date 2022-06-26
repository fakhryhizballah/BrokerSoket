const { con } = require('../connection/mysql');

var getMesin = function (mesinID) {
    var sql = `SELECT * FROM mesin WHERE id_mesin = ?`;
    return new Promise((resolve, reject) => {
        con.query(sql, [mesinID], (error, results) => {
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
}
var getUser = async function (id_user) {
    var sql = `SELECT * FROM user WHERE id_user = ?`;

    return new Promise((resolve, reject) => {
        con.query(sql, [id_user], (error, results) => {
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
const postHistory = async function (id_user, id_mesin, lokasi, nama, vaule, HargaTotal, date_ob) {
    var sql = `INSERT INTO history SET id_master= ?, Id_slave= ?, Lokasi= ?, status= ?, isi= ?,created_at =?`;
    con.query(sql, [id_user, id_mesin, "Isi Ulang Air di " + lokasi + ". ", "Refill " + nama + " " + vaule + " mL", HargaTotal, date_ob], function (err, result) {
        if (err) throw err;
        console.log("history records inserted: " + result.affectedRows);
    });
}
const updateUser = async function (id_user, newDebit, newKredit, date_ob) {
    var sql = `UPDATE user SET debit= ?, kredit=?, updated_at=? WHERE id_user= ?`;
    con.query(sql, [newDebit, newKredit, date_ob, id_user], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + "record(s) User updated");
    });

}

module.exports = {
    getMesin,
    getUser,
    postHistory,
    updateUser
}
