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
  name: 'robkai1q_movingmolveno'
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('Create Vehicle Connected');
  }
});

app.delete(`/api/vehicles/:id`, function( req, res ) {
  let id =+req.params['id']

  connection.query( `DELETE FROM vehicles WHERE id = ?`, [id], ( err, result ) => {
    if (!err) {
      res.status(204).end();
    } else {
        throw err;
    }
  })
});
