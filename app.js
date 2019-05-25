// Imports
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'messaging'
});

let msglist = [];

//connection.connect();

// serve static files
app.use(express.static('public'));

// configure to use body parser
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

var idCounter = 0;


app.get('/api/new-message/', function(req, res) {
  let username = req.query.username;
  let message = req.query.message;

  if(typeof username !== 'undefined' && typeof message !== 'undefined') {
    let msg = {
      id: idCounter,
      date: new Date(),
      username: username,
      message: message,
    };
    console.log(msg);
    msglist.push(msg);
    idCounter++;
  }
  res.end()
});

app.get('/api/retrieve-message-by-id/', function(req, res) {
  let id = req.query.id;
  res.end(msglist.filter(msg => msg.id === id));
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// connection.end();
