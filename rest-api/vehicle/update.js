const mysql = require( 'mysql' )
const express = require( 'express' )
const app = express()
const bodyParser = require( 'body-parser' )
const fn = require('../../private/functions');

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
    console.log('Update Vehicle Connected');
  }
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
// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
