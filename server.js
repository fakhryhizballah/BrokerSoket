// import { broker } from './mqttSub.js';
const {broker} = require ('./mqttSub');


broker.on('message', async function (topic, message){
    // console.log(topic, message.toString())
    if (topic == 'mesin/status/online' ){
        console.log(message.toString() + " is online");
    }
    if (topic == 'mesin/status/offline' ){
        console.log(message.toString() + " is offline");
    }
    if (topic == 'mesin/status/rssi/'){
        const pesan = message.toString()
        console.log(pesan);
        try{
            const data = JSON.parse(pesan)
            console.log("clientid: " + data.clientid)
            console.log("RSSI: " + data.RSSI)
        }catch (err){
            console.log(err)
        }
        // console.log(message.toString() + " is rssi");
    }
});

