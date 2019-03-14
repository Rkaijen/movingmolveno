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

app.get('/api/location', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  connection.query('SELECT * FROM location', (err, location) => {

    if (!err) {
      res.end(JSON.stringify(location));
    }

    else {
      throw err;
    }
  });
});
