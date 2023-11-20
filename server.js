var express = require('express');
var mysql = require('mysql');
var app = express();

app.get('/insert', function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `INSERT INTO userdetails (email, password) VALUES ('${req.query.email}', '${req.query.password}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.send('1 record inserted');
    });
  });
});

app.listen(5000, function () {
  console.log('App is listening on port 3000!');
});
