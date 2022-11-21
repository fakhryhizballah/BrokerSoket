const { con } = require('../connection/mysql');

const log_mesin = function (id, vaule, date_ob) {
    var sql = `INSERT INTO log_mesin SET id_mesin= ?, des= ?, created_at= ?`;
    con.query(sql, [id, vaule, date_ob], function (err, result) {
        if (err) throw err;
        console.log("log_mesin records inserted: " + result.affectedRows);
    });
    return;
};
const UPDATE_mesin = function (vaule, status, date_ob, id) {
    var sql = `UPDATE mesin SET isi= ?, status = ?, updated_at= ? WHERE  id_mesin= ?`;
    con.query(sql, [vaule, status, date_ob, id], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated mesin");
    });
    return;
};
const UPDATE_mesin_vaule = function (vaule, date_ob, id) {
    var sql = `UPDATE mesin SET isi= ?, updated_at= ? WHERE  id_mesin= ?`;
    con.query(sql, [vaule, date_ob, id], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated mesin vaule");
    });
    return;
};
const UPDATE_mesin_status = function (status, date_ob, id) {
    var sql = `UPDATE mesin SET  status = ?, updated_at= ? WHERE  id_mesin= ?`;
    con.query(sql, [status, date_ob, id], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated status mesin");
    });
    return;
};
const UPDATE_mesin_indikator = function (status, date_ob, id) {
    var sql = `UPDATE mesin SET  indikator = ?, updated_at= ? WHERE  id_mesin= ?`;
    con.query(sql, [status, date_ob, id], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated status mesin");
    });
    return;
};

module.exports = {
    log_mesin,
    UPDATE_mesin,
    UPDATE_mesin_status,
    UPDATE_mesin_vaule,
    UPDATE_mesin_indikator
}