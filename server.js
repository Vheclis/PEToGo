const port = 8001
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


var users = {
	'Jeff' : { 
		'password' : '123',
		'type' : 'admin' 
	},
	'Nilson' : { 
		'password' : '1234', 
		'type' : 'client' 
	}
};

var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.redirect('/index.html');
})

app.post('/login', function (req, res) {
	let user = req.body.message.user;
	//console.log(user);
	//console.log(users[user.username]);
	if(users[user.username] != undefined && 
	   users[user.username].password == user.password)
	{
		if(users[user.username].type == 'admin') {
			console.log('admin');
			res.sendFile(path.join(__dirname + '/loginAdmin.html'));
		} else {
			console.log('client');
			res.sendFile(path.join(__dirname + '/loginClient.html'));
		}

	} else {
		console.log('User not found');
		res.sendFile(path.join(__dirname + '/loginDefault.html'));
	}
})

app.get('/form', function (req, res) {
	res.send('ok');
})

app.use(express.static(__dirname + '/'));

app.listen(8001, function () {
	console.log('Serving at ' + port);
})
