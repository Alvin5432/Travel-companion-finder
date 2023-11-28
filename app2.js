const express = require('express');
const session = require('express-session');
// const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000
const app = express();
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))

app.use(express.json());
// app.use(bodyParser.json());


const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {

  socket.on('privateMessage', (data) => {
    const { receiverEmail, message } = data;
    const senderEmail = req.session.user; // Assuming you have the user's email in the session

    // Store the message in the database
    storeMessage(senderEmail, receiverEmail, message);
    
    // Send the message to the receiver's room
    io.to(receiverEmail).emit('message', { senderEmail, message });
  });

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
  function storeMessage(senderEmail, receiverEmail, message) {
    var sql = `
      INSERT INTO messages (sender_email, receiver_email, message)
      VALUES (?, ?, ?)
    `;
    
    con.query(sql, [senderEmail, receiverEmail, message], function (err, result) {
      if (err) throw err;
      console.log("Message stored!");
    });
}
}
app.use(session({
  secret: 'your secret key',
  resave: true,
  saveUninitialized: false,
 
}));



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
        req.session.user = req.query.email; 
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

app.get('/insert', function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  req.session.email = req.query.email;

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    var sql = `INSERT INTO userdetails (email, password) VALUES ('${req.query.email}', '${req.query.password}')`;
    
    con.query(sql, function (err, result) {
      if (err) throw err;

      // Check if the user was inserted successfully
      if (result && result.affectedRows > 0) {
        console.log("User inserted!");
        res.status(200).send('User inserted successfully!');
      } else {
        console.log("User already exists!");
        res.status(200).send('User already exists!');
      }
    });
  });
});


app.get('/storeInterest', function (req, res) {
  const userInterest = req.query.interest;
  const userEmail = req.session.email;

  console.log('Received interest:', userInterest);
    console.log('Received email:', userEmail);


 
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = `UPDATE userdetails SET interest = '${userInterest}' WHERE email = '${userEmail}'`;
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Interest stored!");
      res.status(200).send('Interest stored successfully!');
    });
  });
});


app.get('/saveDestination', function (req, res) {
  const chosenDestination = req.query.destination;
  const userEmail = req.query.userEmail;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    console.log(userEmail);

    var sql = `
        UPDATE userdetails
        SET chosen_destination = ?
        WHERE email = ?
    `;

    con.query(sql, [chosenDestination, userEmail], function (err, result) {
      if (err) throw err;
      res.status(200).send('Destination saved successfully!');
    });
  });
});


// Add an API endpoint to find companions with the same interests and chosen destination
app.get('/searchCompanions', function (req, res) {
  const userEmail = req.session.user;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-socket"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    // Retrieve users with the same interests and chosen destination
    var sql = `
      SELECT email, interest, chosen_destination
      FROM userdetails
      WHERE interest = (SELECT interest FROM userdetails WHERE email = ?)
      AND chosen_destination = (SELECT chosen_destination FROM userdetails WHERE email = ?)
      AND email != ?
    `;

    con.query(sql, [userEmail, userEmail, userEmail], function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
});

app.get('/getMessages', function (req, res) {
  const userEmail = req.session.user;

  var sql = `
    SELECT sender_email, receiver_email, message, sent_at
    FROM messages
    WHERE receiver_email = ?
    ORDER BY sent_at;
  `;

  con.query(sql, [userEmail], function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});


