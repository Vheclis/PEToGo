const port = 8001
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./database');


var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.redirect('/index.html');
})

var verifyUndefined = function(req, res, next) {
	if(req.body == undefined || req.body.message == undefined) {
		console.log('Bad request');
		res.status(400).send('Bad request');
	} else {
		console.log('Verified');
		next();
	}
}

var users = {
	'Jeff' : { 'password' : '123', 'type' : 'admin' },
	'Nirto' : { 'password' : '1234', 'type' : 'client' }
}
app.post('/login', verifyUndefined, function (req, res) {
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

app.get('/search', verifyUndefined, function (req, res) {
	let data = req.body.message;
	db.search(Object.keys(data)[0], data, function(result) {
		if (result.isError) {
			console.log('error');
			res.status(400).send(result.data);
		} else {
			console.log('success');
			res.status(200).send(result.data);
		}
	});
	
})

app.post('/insert', verifyUndefined, function (req, res) {
	let data = req.body.message;
	console.log(data);
	db.insert(Object.keys(data)[0], data, function(result) {
		if (result.isError) {
			console.log('error');
			res.status(400).send(result.message);
		} else {
			console.log('success');
			res.send(result.message);
		}
	});
	
})

app.put('/update', verifyUndefined, function (req, res) {
	let data = req.body.message;
	db.update(Object.keys(data)[0], data, function(result) {
		if (result.isError) {
			console.log('error');
			res.status(400).send(result.message);
		} else {
			console.log('success');
			res.status(200).send(result.message);
		}
	});
	
})


app.delete('/remove', verifyUndefined, function (req, res) {
	let data = req.body.message;
	db.remove(Object.keys(data)[0], data, function(result) {
		if (result.isError) {
			console.log('error');
			res.status(400).send(result.message);
		} else {
			console.log('success');
			res.status(200).send(result.message);
		}
	});
	
})


app.listen(8001, function () {
	console.log('Serving at ' + port);
})
