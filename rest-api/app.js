"use strict";

const mysql = require("mysql");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
const fn = require('../private/functions');

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

app.get('/api/locations', function(req, res) {

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

app.get('/api/locations/:id', function(req, res) {

  let id = +req.params.id

  connection.query('SELECT * FROM location where id=?', id, (err, rows) => {
    if (!err) {
      console.log('Data received from Db:\n');

      let onelocation = rows[0];

      if (onelocation) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(onelocation));
      } else {
        res.setHeader('Content-Type', 'application/json')

        res.status(404).end();
      }
    } else {
      throw err;
    }
  });
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


app.delete(`/api/vehicles/:id`, function( req, res ) {
  let id =+req.params['id']

  connection.query( `DELETE FROM vehicle WHERE id = ?`, [id], ( err, result ) => {
    if (!err) {
      res.status(204).end();
    } else {
        throw err;
    }
  })
});


app.get('/api/vehicles', function(req, res) {

  res.setHeader('Content-Type', 'application/json');

  connection.query('SELECT * FROM vehicle', (err, vehicle) => {

    if (!err) {
      res.end(JSON.stringify(vehicle));
    }

    else {
      throw err;
    }
  });
});


app.get('/api/vehicles/:id', function(req, res) {

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


app.put('/api/vehicles/:id', function(req, res) {

      // First read id from params
      let id = +req.params.id
      let body = req.body;


      connection.query(
        'UPDATE vehicle SET type=?, starting_price=?, price_per_km = ? Where id = ?',
        [body.type, body.starting_price, body.price_per_km, id],
        (err, result) => {
          if (!err) {
            console.log(`Changed ${result.changedRows} row(s)`);

            // end of the update => send response
            // execute a query to find the result of the update
            connection.query('SELECT * FROM vehicle where id=?', [id], (err, rows) => {
              if (!err) {
                console.log('Data received from Db:\n');

                let user = rows[0];

                console.log(user);
                if (user) {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(user));
                } else {
                  res.setHeader('Content-Type', 'application/json')
                  console.log("Not found!!!");
                  res.status(404).end(); // rloman send 404???
                }
              } else {
                throw err;
              }
            });
          }
          else {
            throw err;
          }
    });
});


app.get('/api/vehicles/free', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  // connection.query('SELECT vehicle_id FROM vehicle WHERE endtime IS NOT NULL', (err, vehicle) => {
  connection.query('SELECT ride.vehicle_id, vehicle.type FROM vehicle RIGHT JOIN ride on vehicle.id=ride.vehicle_id WHERE ride.endtime IS NOT NULL', (err, vehicle) => {
    if (!err) {
      res.end(JSON.stringify(vehicle));
    } else {
      throw err;
    }
  });
});


app.get('/api/vehicles/free/:amount/:distance', function(req, res) {

  let amount = 0;
  let distance = 0;
  if ( fn.isNumeric( req.params.amount ) && fn.isNumeric( req.params.distance ) ) {
    amount = req.params.amount;
    distance = req.params.distance;
  }

  res.setHeader('Content-Type', 'application/json');
  // connection.query('SELECT vehicle_id FROM vehicle WHERE endtime IS NOT NULL', (err, vehicle) => {
  connection.query('SELECT vehicle.id, vehicle.type, vehicle.starting_price, vehicle.price_per_km FROM vehicle LEFT JOIN ride on ride.vehicle_id=vehicle.id WHERE ride.endtime IS NOT NULL', (err, vehicle) => {
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
