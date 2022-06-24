require('dotenv').config();
// -- Mqtt
var mqtt = require('mqtt');
// Prodution mqtt
var broker = mqtt.connect(process.env.mqtt_host, {
    username: process.env.mqtt_username,
    password: process.env.mqtt_password,
    clientId: process.env.mqtt_client_id + Math.random().toString(16),
    connectTimeout: 1000,
    keepalive:10
});
broker.on('connect', function () {
    console.log('Server is connect');
    broker.subscribe('mesin/status/#');
    // client.subscribe('Sinyal', function (err) {
    //     if (!err) {
    //         console.log("Sinyal Cek")
    //         // client.publish('tes/masuk', 'Hello ada sinyal')
    //     }
    // })
    // client.subscribe('mersure', function (err) {
    //     if (!err) {
    //         console.log("Mersure Cek")
    //         // client.publish('tes/masuk', 'Hello mqtt')
    //     }
    // })
    // client.subscribe('Offline', function (err) {
    //     if (!err) {
    //         console.log("Offline Cek")
    //         // client.publish('tes/masuk', 'Hello mqtt')
    //     }
    // })
    // client.subscribe('data/log', function (err) {
    //     if (!err) {
    //         console.log('data/log Cek')
    //         // client.publish('test', 'Hello mqtt')
    //     }
    // })
    // client.subscribe('current', function (err) {
    //     if (!err) {
    //         console.log('flow current')
    //         // client.publish('test', 'Hello mqtt')
    //     }
    // })
    // client.subscribe('nodeTrans', function (err) {
    //     if (!err) {
    //         // client.publish('test', 'Hello mqtt')
    //         console.log('Transaksi Stasiun')
    //     }
    // })

})
// exports.client = client;
// exports.conMysql = con;
module.exports = {
    broker,
  }