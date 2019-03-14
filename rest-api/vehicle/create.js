const mysql = require( 'mysql' )
const express = require( 'express' )
const app = express()
const bodyParser = require( 'body-parser' )
const fn = require('../private/functions');

app.use( bodyParser.json() )
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
// MYSQL CONNECT
const connection = fn.dbconnection(mysql);

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('Create Vehicle Connected');
  }
});

app.post('/rest-api/vehicles', function(req, res) {

let vehicle = req.body;
connection.query('INSERT INTO vehicles SET ?', vehicle, (err, result) => {
  if (!err) {
    res.setHeader('Content-Type', 'application/json')
    connection.query('SELECT * FROM vehicles where id=?', result.insertId, (err, rows) => {
      if (!err) {
        let question = rows[0];
        if (question) {
          res.setHeader('Content-Type', 'application/json')
          res.status(201).end(JSON.stringify(question));
        } else {
          res.setHeader('Content-Type', 'application/json')
          res.status(404).end();
        }
      } else {
        throw err;
      }
    });
  } else {
    throw err;
  }
});
});
// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
