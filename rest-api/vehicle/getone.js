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

app.get('/api/vehicle/:id', function(req, res) {

  let id = +req.params.id

  connection.query('SELECT * FROM vehicle where id=?', id, (err, rows) => {
    if (!err) {
      console.log('Data received from Db:\n');

      let onevehicle = rows[0];

      if (onevehicle) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(onevehicle));
      } else {
        res.setHeader('Content-Type', 'application/json')

        res.status(404).end();
      }
    } else {
      throw err;
    }
  });
});
