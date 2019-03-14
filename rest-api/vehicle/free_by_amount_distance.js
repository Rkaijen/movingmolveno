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
app.get('/api/vehicles/free/:amount/:distance', function(req, res) {

  let amount = 0;
  let distance = 0;
  if ( fn.isNumeric( req.params.amount ) && fn.isNumeric( req.params.distance ) ) {
    amount = req.params.amount;
    distance = req.params.distance;
  }

  res.setHeader('Content-Type', 'application/json');
  // connection.query('SELECT vehicle_id FROM vehicle WHERE endtime IS NOT NULL', (err, vehicle) => {
  connection.query('SELECT ride.vehicle_id, vehicle.type, vehicle.starting_price, vehicle.price_per_km FROM vehicle RIGHT JOIN ride on vehicle.id=ride.vehicle_id', (err, vehicle) => {
    if (!err) {
      console.log(vehicle.length);
      for (let i in vehicle) {
        vehicle[i]["amount"] = amount;
        vehicle[i]["distance"] = distance;
        vehicle[i]["total_price"] = vehicle[i]["starting_price"] + (vehicle[i]["price_per_km"] * distance);
        console.log(vehicle[i]);
      }
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
