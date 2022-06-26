var mysql = require('mysql');
const con = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: 3306
});
con.connect(function (err) {
    if (err) throw err;
    console.log("My SQL Connected!");
});
module.exports = {
    con,
}