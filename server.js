const port = 8001
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
//const db = require('./database');
const nano = require('nano')('http://localhost:5984');


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

const db = nano.use('petogo');
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
//app.dplete('/remove', verifyUndefined, function (req, res) {
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
	db.view('docs', 'getLogin', {key: [user.username, user.password], limit: 1}, function(err, body) {
		if(err) {
			console.log("ERROR");
			console.log(err);
			res.status(400).send("ERROR");
		} else {
			console.log("FOUND");
			let res_user = body.rows[0].value;
			res_user.username = res_user._id;
			delete res_user['_id'];
			delete res_user['_rev'];
			delete res_user['typeDB'];
			delete res_user['password'];
			console.log(res_user);
			res.send(res_user);
		}
	});
});

//offers
app.get('/offers', (req, res) => {
	res.send(req.url);
});

//products
app.get('/products/:count/:start', (req, res) => {
	db.view('docs', 'getProducts', {limit: req.params.count, skip: req.params.start}, function(err, body) {
		if(err) {
			console.log("ERROR");
			console.log(err);
			res.status(400).send("ERROR");
		} else {
			console.log("FOUND");
			let rows = [];
			let row_value;
			rows = body.rows.map(row => {
				row_value = row.value;
				delete row_value['_id'];
				delete row_value['_rev'];
				delete row_value['typeDB'];
				return row_value;
			});
			console.log(rows);
			res.send(rows);
		}
	});
});

//query
app.get('/product', (req, res) => {
	db.view('docs', 'getProdStore', {key: req.query.id}, function(err, body) {
		if(err) {
			console.log("ERROR");
			console.log(err);
			res.status(400).send("ERROR");
		} else {
			console.log("FOUND");
			let rows = [];
			let row_value;
			rows = body.rows.map(row => {
				row_value = row.value;
				delete row_value['_id'];
				delete row_value['_rev'];
				delete row_value['typeDB'];
				return row_value;
			});
			console.log(rows);
			res.send(rows);
		}
	});
	console.log(req.query);
	res.send(req.url);
});

//services
app.get('/service', (req, res) => {
	let status = req.query.status;
	let date = req.query.date;
	let type = req.query.type;
	if (type == 'todos' || type == 'Todos') {
		db.view('docs','getServices', {startkey : [date,status], endkey : [date, status,{},{},{}]},function(err,body){
			if(err){
				console.log("ERROR");
				console.log(err);
				res.status(400).send("ERROR");			
			} else {
				res.send(body.rows);
			}
		})
	} else {
		db.view('docs','getServices', {startkey : [date,status,type], endkey : [date, status, type,{},{}]},function(err,body){
			if(err){
				console.log("ERROR");
				console.log(err);
				res.status(400).send("ERROR");			
			} else {
				res.send(body.rows);
			}
		})
	}
});

//schedule
app.put('/schedule', (req, res) => {
	let service = req.body.service;

	db.get(service.id, function(err, body){
		
		body.status = 'booked';
		//console.log(body);
		db.insert(body, req.body.id, function(err, body){
			if(err)
			{
				console.log("ERROR");
				console.log(err);
				res.status(400).send("ERROR");			
			} else {
				console.log("SERVICE UPDATED");
			}
		})
	});
	res.send(req.url);
});

//pets
app.get('/pet/:user', (req, res) => {
	let owner = req.params.user
	db.view('docs', 'getPets', {startkey : [owner], endkey : [owner, {}]}, function(err,body){
		if(err)
		{
			console.log("ERROR");
			console.log(err);
			res.status(400).send("ERROR");
		} else {
			res.send(body);
		}
	});
});



//insert
app.post('/insert/:db', (req, res) => {
	let typeDB = req.params.db;
	let data = req.body[typeDB];
	data["typeDB"] = typeDB;
	if(typeDB == 'user') {
		db.insert(data, data.username, function(err, body){
			if(err){
				console.log("ERROR");
				console.log(err);
				res.status(400).send("ERROR");
			} else {
				console.log("INSERT COMPLETE");
			}
		});
	} else {
		db.insert(data, function(err, body){
			if(err){
				console.log("ERROR");
				console.log(err);
				res.status(400).send("ERROR");
			} else {
				console.log("INSERT COMPLETE");
			}
		});
	}
	res.send(req.url);
});

app.listen(8001, function () {
	console.log('Serving at ' + port);
})
