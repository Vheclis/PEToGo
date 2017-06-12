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
	if(req.body == undefined) {
		console.log('Bad request');
		res.status(400).send('Bad request');
	} else {
		console.log('Verified');
		next();
	}
}

app.post('/login', verifyUndefined, function (req, res) {
	db.search('user', req.body.user, function(result) {
		if (result.isError) {
			console.log('/login error');
			res.status(400).send("User not found");
		} else {
			console.log('/login success');
			let user = result.data[0];
			res.json(user);
		}
	});
})

app.get('/search/*', verifyUndefined, function (req, res) {
	let param = req.params;
	console.log(param);
	let data = JSON.parse(param[0]); 
	let bd = Object.keys(data)[0];
	db.search(bd, data[bd], function(result) {
		if (result.isError) {
			console.log('/search error');
			res.status(400).send(result.data);
		} else {
			console.log('/search success');
			res.status(200).send(result.data);
		}
	});
	
})

app.post('/insert', verifyUndefined, function (req, res) {
	console.log("/insert");
	let data = req.body;
	console.log(data);
	let bd = Object.keys(data)[0];
	db.insert(bd, data[bd], function(result) {
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
	let data = req.body;
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
	let data = req.body;
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
