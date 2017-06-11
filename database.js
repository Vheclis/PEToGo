var tupleMatches = function (query, tup) {
	for(var k in query) {
		if(query[k] != tup[k]) {
			console.log("tuple matches false");
			return false;
		}
	}
	return true;
}

function Table(key, autoId) {
	this.data = [];
	this.autoId = autoId;
	this.id = 0;
	this.key = key;
}
Table.prototype.print = function () {
	console.log(this.autoId);
}

Table.prototype.search = function (query) {
	let result = {
		'data' : [],
		'message' : 'ok',
		'isError' : false
	};

	result.data = this.data.filter(function(tuple) {
		return tupleMatches(query, tuple);
	});

	//console.log('search db result: ');
	for(var i = 0; i < result.data.length; i++) {
		console.log(result.data[i]);
	}
	//console.log('end search db');

	if (result.data.length == 0) {
		result.isError = true;
		result.message = 'No tuples found';
		console.log("No tuple found");
	}
	return result;
}

Table.prototype.insert = function (newtuple) {
	let result = {
		'data' : [],
		'message' : 'ok',
		'isError' : false
	};

	if (this.autoId) {
		newtuple[this.key] = this.id;
		this.id++;
	}

	self = this;

	if (newtuple[this.key] != undefined) {
		let array = this.data.filter(function(tuple) {
			return tuple[self.key] == newtuple[self.key];
		});

		if(array.length == 0) {
			self.data.push(newtuple);
			return result;
		} else {
			result.isError = true;
			result.message = 'Cannot repeat key';
			return result;
		}
	} else {
		result.isError = true;
		result.message = 'Key not defined';
		return result;

	}
}

Table.prototype.update = function (tuple) {
	let result = {
		'data' : [],
		'message' : 'ok',
		'isError' : false
	};

	if (tuple[this.key] != undefined) {
		let array = this.data.filter(function(tuple) {
			return tupleMatches(query, tuple);
		});

		if(array.length == 0) {
			result.isError = true;
			result.message = 'Tuple not found';
			return result;
		} else if (array.length > 1) {
			result.isError = true;
			result.message = 'Something wrong...';
			return result;
		} else {
			tuple
			tuple.forEach(function(value, key, item) {
				array[0][key] = value;
			});
			return result;
		}
	}
}

Table.prototype.remove = function (user) {
	let result = {
		'data' : [],
		'message' : 'ok',
		'isError' : false
	};
	let prevLength = data.length;
	data = this.data.filter(function(tuple) {
		return !tupleMatches(query, tuple);
	});
	if (data.length == data.length) {
		result.message = 'Nothing deleted';
		result.isError = true;
		return result;
	}
	return result;
}

new Table('id', true)
new Table('id', true)
new Table('id', true)
new Table('username', false)
new Table('id', true)

let Base = {
	'pet' : new Table('id', true),
	'service' : new Table('id', true),
	'product' : new Table('id', true),
	'user' : new Table('username', false),
	'schedule' : new Table('id', true)
}

//console.log(Base.pet.autoId);
//console.log(Base.service.autoId);
//console.log(Base.product.autoId);
//console.log(Base.user.autoId);
//console.log(Base.schedule.autoId);

Base.user.insert({'id' : '00', 'telephone': '(19)3533 - 3324', 'email': 'victor.heclis@usp.br', 'address': '', 'username' : 'Jeff', 'password' : '123', 'type' : 'admin' , 'img':'https://goo.gl/SWdfhw'});
Base.user.insert({'id' : '01', 'telephone': '(11)3431 - 3844', 'email': 'nilson.furquim@usp.br', 'address': 'USP','username' : 'Nilson', 'password' : '1234', 'type' : 'client','img':''});

Base.product.insert({'name' : 'whiskas', 'shortDescription' : 'Ração para gatos','amount': 10 , 'bigDescription':'Raaação para gaatos' ,'price' : 49.90});
Base.product.insert({'name' : 'pedrigree', 'shortDescription' : 'Ração para doggos', 'amount': 10 , 'bigDescription':'Raaação para dooogos' , 'price' : 59.90});
Base.product.insert({'name' : 'pedrigree2', 'shortDescription' : 'Ração para doggos2','amount': 10 , 'bigDescription':'Raaação para dooogos2' , 'price' : 59.903});
Base.product.insert({'name' : 'pedrigree3', 'shortDescription' : 'Ração para doggos3','amount': 10 , 'bigDescription':'Raaação para dooogos3' , 'price' : 59.903});
Base.product.insert({'name' : 'dogshow', 'shortDescription' : 'Ração para doggos shows','amount': 10 , 'bigDescription':'Raaação para dooogos4' , 'price' : 109.90});

Base.service.insert({'username' : '', 'type' : 'Banho', 'date' : '2017-06-10', 'time' : '18:00', 'type' : 'Banho', 'status' : 'free'});
Base.service.insert({'username' : '', 'type' : 'Banho', 'date' : '2017-06-10', 'time' : '19:00', 'type' : 'Banho', 'status' : 'free'});
Base.service.insert({'username' : '', 'type' : 'Banho', 'date' : '2017-06-10', 'time' : '16:00', 'type' : 'Banho', 'status' : 'free'});
Base.service.insert({'username' : '', 'type' : 'Banho', 'date' : '2017-06-10', 'time' : '8:00', 'type' : 'Banho', 'status' : 'free'});

exports.search = function(table, data, callback) {
	console.log("search "+ table);
	let result = Base[table].search(data);
	callback(result);
}

exports.insert = function(table, data, callback) {
	let result = Base[table].insert(data);
	callback(result);
}

exports.update = function(table, data, callback) {
	let result = Base[table].update(data);
	callback(result);
}

exports.remove = function(table, data, callback) {
	let result = Base[table].remove(data);
	callback(result);
}
