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

app.get('/api/rides/:id', function(req, res) {

  let id = +req.params.id

  connection.query('SELECT * FROM ride where id=?', id, (err, rows) => {
    if (!err) {
      console.log('Data received from Db:\n');

      let oneride = rows[0];

      if (oneride) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(oneride));
      } else {
        res.setHeader('Content-Type', 'application/json')

        res.status(404).end();
      }
    } else {
      throw err;
    }
  });
});

// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
