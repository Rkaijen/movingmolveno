"use strict";

const mysql = require("mysql");

let express = require("express");

let app = express();

let bodyParser = require("body-parser");

const fn = require('../../private/functions');

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const connection = fn.dbconnection(mysql);

connection.connect((err) => {

  if (err) {
    throw err;
  }

  else {
    console.log('Connected!');
  }
});

app.get('/api/rides', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  connection.query('SELECT * FROM ride', (err, ride) => {

    if (!err) {
      res.end(JSON.stringify(ride));
    }

    else {
      throw err;
    }
  });
});

// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
