require('dotenv').config();
// -- Mqtt
var mqtt = require('mqtt');
// Prodution mqtt
var broker = mqtt.connect(process.env.mqtt_host, {
    username: process.env.mqtt_username,
    password: process.env.mqtt_password,
    clientId: process.env.mqtt_client_id + Math.random().toString(16),
    connectTimeout: 1000,
    keepalive: 10
});
broker.on('connect', function () {
    console.log('Mqtt is connect');
    broker.subscribe('$share/server/mesin/status/#');
    broker.subscribe('$share/server/mesin/data/log/#');
    broker.subscribe('$share/server/nodeTrans');
})

module.exports = {
    broker,
}