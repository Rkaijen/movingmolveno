const mysql = require( 'mysql' )
const express = require( 'express' )
const app = express()
const bodyParser = require( 'body-parser' )

app.use( bodyParser.json() )
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
const connection = mysql.createConnection({
  host: '185.87.187.148',
  user: 'robkai1q_movingmolveno',
  pwrd: 'mcrajmolveno2019',
  name: 'nodrobkai1q_movingmolvenoetest'
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('Create Vehicle Connected');
  }
});

app.put('/rest-api/vehicles/:id', function(req, res) {

      // First read id from params
      let id = +req.params.id
      let body = req.body;


      connection.query(
        'UPDATE vehicles SET type=?, starting_price=?, price_per_km = ? Where id = ?',
        [body.type, body.starting_price, body.price_per_km, id],
        (err, result) => {
          if (!err) {
            console.log(`Changed ${result.changedRows} row(s)`);

            // end of the update => send response
            // execute a query to find the result of the update
            connection.query('SELECT * FROM vehicles where id=?', [id], (err, rows) => {
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
