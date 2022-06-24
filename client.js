require('dotenv').config();
// -- Mqtt
var mqtt = require('mqtt');
const clientid = process.env.mqtt_client_id + Math.random().toString(36)
console.log(clientid);
// Prodution mqtt
var broker = mqtt.connect(process.env.mqtt_host, {
    username: process.env.mqtt_username,
    password: process.env.mqtt_password,
    clientId: clientid,
    will: {
        topic: 'mesin/status/offline',
        payload: clientid
    }
});
broker.on('connect', function () {
    broker.publish('mesin/status/online', clientid);
    setInterval(intervalFunc, 1500);
    // broker.subscribe('mesin/status/sync',function(err){
    //     if(err){
    //         console.log('sync');
    //         broker.publish('mesin/status/rssi', clientid);
    //     }
    // });
});

function intervalFunc() {
    console.log('Cant stop me now!');
    let rssi = Math.floor(Math.random() * 10);
    data={
        "clientid" : clientid,
        "RSSI" : rssi,
        "Storage" : rssi
    }
    broker.publish('mesin/status/rssi/', JSON.stringify(data).toString());
    // broker.publish('mesin/status/rssi/', (data).toString());

}

// setInterval(intervalFunc, 1500);