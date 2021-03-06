var express = require('express')
var mongoose = require('mongoose')

var app = express()
var dbUri = 'mongodb://localhost:27017/devices'

var dbConnection = mongoose.createConnection(dbUri)
var Schema = mongoose.Schema
var deviceSchema = new Schema ({
  deviceId: String,
  name: String,
  status: String
})
var Devices = dbConnection.model('Devices', deviceSchema, 'devices')

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
  res.send('ok')
})

app.get('/devices', function (req, res, next) {
  Devices.find({}, function (error, deviceList) {
    if (error) return next(error)
    var result = JSON.stringify(deviceList)
    console.log("Here is the result: " + result)
    res.send(result)
  })
})

// app.get('/devices/:id', function (req, res, next) {
//   Devices.findOne({deviceId: req.params.id}, function (error, device) {
//     if (error) return next(error)
//     console.log("fetching device id: " + req.params.id)
//     res.send(device)
//   })
// })

app.get('/devices/:id', function (req, res, next) {
  var thisDevice = Devices.findOne({deviceId: req.params.id}, function (error, deviceResult) {
    console.log("here is the query: ", req.content)
    // var dataMessage = req.body
    var newVal = deviceResult.status == 'off' ? 'on' : 'off'
    console.log("this device: ", deviceResult)
    console.log("this newVal: ", newVal)
    Devices.update({deviceId: req.params.id}, {$set: {status: newVal} }, function (error, device) {
      console.log("PUT for single device: " + req.params.id + " new val: " + newVal)
      res.send(device)
    })
  })
})

app.get('/viewertest', function (req, res, next) {
  res.sendfile('./viewertest/index.html')
})

var server = require('http').createServer(app).listen(3001)
