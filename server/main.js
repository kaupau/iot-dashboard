var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:9000');
const express = require('express');
var cors = require('cors');
const path = require('path');
// temporary, remove later.
var sim = require('./sim.js');
var dbutils = require('./dbutils.js');

client.on('connect', function() {
    console.log('connected');

    sim.simulate(client);
});

client.on('error', function(error) {
    console.log('error: ' + error);
    // try connecting again? send an email? idk?
});

client.on('message', function(topic, message, packet) {
    console.log('topic is ' + topic);
    console.log('message is ' + message);
    dbutils.updateLog(topic, message);
    //command = `INSERT INTO Log
    //VALUES (${topic.split('/')[0]}, ${topic.split('/')[1]}, ${topic.split('/')[2]}, ${message}, time, error?)`
});

// delete below later
client.subscribe('#');

//dbutils.getTopics().forEach(topic => {
    //client.subscribe(topic);
//});

var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "build")));
var port = process.env.PORT || 4000;;
app.listen(port, '0.0.0.0', 511, () => console.log(`Example app listening at http://localhost:${port}`))

app.post('/api/register', (req, res) => {dbutils.register(req, res)});

app.post('/api/login', (req, res) => {dbutils.login(req, res)});

app.get('/api/users', (req, res) => {dbutils.getUsers(req, res)});

// below need to be cleaned up and matched with the client requests.
app.get('/api/devices/dashboard/settings/:device_id', (req, res) => {dbutils.getSettings(req, res)});

app.post('/api/devices/createdevice', (req, res) => {dbutils.createDevice(req, res)});

app.get('/api/devices/dashboard/overviews', (req, res) => {dbutils.getDevices(req, res)});

app.get('/api/devices/dashboard/overviews/:device_id', (req, res) => {dbutils.getDeviceOverviews(req, res)});

app.post('/api/devices/dashboard/settings/:device_id', (req, res) => {dbutils.setSettings(req, res)});

app.delete('/api/devices/dashboard/settings/:device_id/delete', (req, res) => {dbutils.deleteDevice(req,res)});

app.post('/api/users/generateinvitekey', (req, res) => {dbutils.generateInviteKey(req, res)});

app.post('/api/devices/log', (req, res) => {dbutils.getLogs(req, res)});

app.post('/api/devices/log/count', (req, res) => {dbutils.countLogs(req, res)});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, "..", "build/index.html"));
    console.log("sdf");
});



/*
Broker (this server broker)
Publisher (sensors)
Subscriber (this node server)
Client (Web App) will request data from node server

Topics:
Building/SensorID/Field

All sensor values go to an SQL DB
Building
SensorID
Field (Type)
Field Value
Datetime Published (determined by the server)
Log (if there are any error messages?)

Maybe set something up in this node server that only subscribes 
to certain topics to avoid DDOS attacks?

CREATE TABLE Log (
    building varchar(255),
    sensorID varchar(255),
    field varchar(255),
    value FLOAT,
    time TIMESTAMP,
    message varchar(255)
)

CREATE TABLE Devices (
    building varchar(255),
    sensors (array?)
)

Users (username, password, email?, first name, last name)
Devices (device name, building, date added, last updated, description)

command = `INSERT INTO Users (${username}, ${password}, ${email}, ${first_name}, ${last_name})

/api/register POST
/api/login POST
/api/users POST
    let's have a functionality to send invitations to people whom we want to sign up. they will need a specific key that they enter before signing up, 
    to prevent outsiders from randomly joining our dashboard and viewing our stuffs.
/api/log POST
    we can have a next button. when the next button is clicked, it returns more logs. 
    in the logs post, we can request for how much logs we need.
/api/log/download POST
    create and return a .csv file with the data
/api/devices/ GET
    retrieve all devices
/api/devices/add POST
    here we will subscribe our server to that particular devices.
    Front End: 
        Location, Name, Description
/api/devices/remove POST
/api/devices/edit
    have an ON/OFF option for devices

enable adding resources. 
first off, implement:
adding sensors, editing sensors.


SensorView
More ->
Select/Edit Zone
Select/Edit Sensor
Select/Edit Resources

https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-an-express-server-on-heroku-32244fe5a250/
https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9

Prevent SQL Injections somehow
*/