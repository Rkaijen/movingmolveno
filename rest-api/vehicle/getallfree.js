"use strict";

// NPM/REST INITIALIZATION
const mysql = require('mysql');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const fn = require('../../private/functions');

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MYSQL CONNECT
const connection = fn.dbconnection(mysql);
connection.connect((err) => {
  if (err) { throw err }
});

// Get all free vehicles
app.get('/api/vehicle/free', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  // connection.query('SELECT * FROM vehicle', (err, vehicle) => {
  connection.query('SELECT * FROM vehicle LEFT JOIN ride ON ride.vehicle_id WHERE ride.endtime IS NOT NULL', (err, vehicle) => {
    if (!err) {
      res.end(JSON.stringify(vehicle));
    } else {
      throw err;
    }
  });
});

// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
