const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000
const app = express();
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))


const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: In production, set secure to true to ensure the cookie is only sent over HTTPS
}));

// ...existing code...

app.get('/login', function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `SELECT * FROM userdetails WHERE email = '${req.query.email}' AND password = '${req.query.password}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        console.log("User found!");
        req.session.user = req.query.email; // Set the user in the session
        res.status(200).send('User found!');
      } else {
        console.log("User not found!");
        res.status(401).send('User not found!');
      }
    });
  });
});

app.get('/users', function(req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `SELECT email FROM userdetails WHERE email LIKE '%${req.query.search}%' AND email != '${req.session.user}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
});
