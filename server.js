var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;

var login = require('./login');

mongoClient.connect('mongodb://localhost/authFB', function(err, db) {
    if(err) { 
        return console.dir(err); 
    } else {
        console.log("connected to database");
        db.close();
    }
});

app.use(express.static(__dirname + '/auth'));
app.use(bodyParser.json());

app.post('/login', login.loginWithFB);
app.post('/logout', login.logoutFromFB);

app.listen(3000);
console.log("server running on 3000");
