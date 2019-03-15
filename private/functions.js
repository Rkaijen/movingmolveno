const dbserver = require('./db');

exports.dbconnection = function(mysql) {
  // MYSQL CONNECT
  const connection = mysql.createConnection({
    host: dbserver.db().host,
    user: dbserver.db().user,
    password: dbserver.db().pwrd,
    database: dbserver.db().name
  });
  return connection;
}

exports.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
