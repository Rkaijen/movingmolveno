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
    console.log('Delete Vehicle Connected');
  }
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
// Run server on port 8081
let server = app.listen(8081, function() {
  console.log("Server respond at http://%s:%s", server.address().address, server.address().port)
});
