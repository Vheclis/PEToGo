const port = 8001
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
//const db = require('./database');
const nano = require('nano')('http://localhost:5984');

//nano.db.create('user');
//nano.db.create('product');
//nano.db.create('service');
//nano.db.create('pet');
//nano.db.create('buy');
//nano.db.create('offers');


//nano.db.destroy('alice', function() {
//	nano.db.create('alice', function() {
//	var alice = nano.use('alice');
//	alice.insert({ crazy: true }, 'rabbit', function(err, body, header) {
//		if (err) {
//			console.log('[alice.insert] ', err.message);
//			return;
//		}
//			console.log('you have inserted the rabbit.')
//			console.log(body);
//		});
//	});
//});

const express = require('express');
const app = express();

const db = {
	'user' : nano.use('user'),
	'product' : nano.use('product'),
	'service' : nano.use('service'),
	'pet' : nano.use('pet'),
	'buy' : nano.use('buy'),
	'offers' : nano.use('offers')
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));



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

//app.post('/login', verifyUndefined, function (req, res) {
//	db.search('user', req.body.user, function(result) {
//		if (result.isError) {
//			console.log('/login error');
//			res.status(400).send("User not found");
//		} else {
//			console.log('/login success');
//			let user = result.data[0];
//			res.json(user);
//		}
//	});
//})
//
//app.get('/search/*', verifyUndefined, function (req, res) {
//	let param = req.params;
//	console.log(param);
//	let data = JSON.parse(param[0]); 
//	let bd = Object.keys(data)[0];
//	db.search(bd, data[bd], function(result) {
//		if (result.isError) {
//			console.log('/search error');
//			res.status(400).send(result.data);
//		} else {
//			console.log('/search success');
//			res.status(200).send(result.data);
//		}
//	});
//	
//})
//
//app.post('/insert', verifyUndefined, function (req, res) {
//	console.log("/insert");
//	let data = req.body;
//	console.log(data);
//	let bd = Object.keys(data)[0];
//	db.insert(bd, data[bd], function(result) {
//		if (result.isError) {
//			console.log('error');
//			res.status(400).send(result.message);
//		} else {
//			console.log('success');
//			res.send(result.message);
//		}
//	});
//	
//})
//
//app.put('/update', verifyUndefined, function (req, res) {
//	console.log("/update");
//	let data = req.body;
//	console.log(data);
//	let bd = Object.keys(data)[0];
//	db.update(bd, data[bd], function(result) {
//		if (result.isError) {
//			console.log('error');
//			res.status(400).send(result.message);
//		} else {
//			console.log('success');
//			res.status(200).send(result.message);
//		}
//	});
//	
//})
//
//
//app.delete('/remove', verifyUndefined, function (req, res) {
//	console.log("/remove");
//	let data = req.body;
//	console.log(data);
//	let bd = Object.keys(data)[0];
//	db.remove(bd, data[bd], function(result) {
//		if (result.isError) {
//			console.log('error');
//			res.status(400).send(result.message);
//		} else {
//			console.log('success');
//			res.status(200).send(result.message);
//		}
//	});
//	
//})

//login
//needs:
app.post('/login', (req, res) => {
	let user = req.body.user;
	res.send(req.url);
});

//offers
app.get('/offers', (req, res) => {
	res.send(req.url);
});

//products
app.get('/products/:count/:start', (req, res) => {
	res.send(req.url);
});

//query
app.get('/product', (req, res) => {
	console.log(req.query);
	res.send(req.url);
});

//services
app.get('/service', (req, res) => {
	res.send(req.url);
});

//schedule
app.put('/schedule', (req, res) => {
	res.send(req.url);
});

//pets
app.get('/pet', (req, res) => {
	res.send(req.url);
});

//insert
app.post('/insert/:db', (req, res) => {
	res.send(req.url);
});

app.listen(8001, function () {
	console.log('Serving at ' + port);
})
