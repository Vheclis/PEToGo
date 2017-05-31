var tupleMatches = function (query, tup) {
	for(var k in query) {
		if(query[k] != tup[k]) {
			return false;
		}
	}
	return true;
}

var newTable = function(key, autoID) {
	this.data = [];
	this.autoID = autoID;
	this.id = 0;
	this.key = key;
	this.search = function (query) {
		let result = {
			'data' : [],
			'message' : 'ok',
			'isError' : false
		};

		result.data = this.data.filter(function(tuple) {
			return tupleMatches(query, tuple);
		});

		if (result.data.length == 0) {
			result.isError = true;
			result.message = 'No tuples found';
		}
		return result;
	}

	this.insert = function (newtuple) {
		let result = {
			'data' : [],
			'message' : 'ok',
			'isError' : false
		};

		if (this.autoID) {
			newtuple[this.key] = this.id;
			this.id++;
		}

		if (newtuple[this.key] != undefined) {
			let array = this.data.filter(function(tuple) {
				return tuple[this.key] == newtuple[this.key];
			});

			if(array.length == 0) {
				data.push (newtuple);
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

	this.update = function (tuple) {
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

	this.remove = function (user) {
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
	return this;
}

let Base = {
	'user' : newTable('username', false),
	'pet' : newTable(id, true),
	'service' : newTable(id, true),
	'product' : newTable(id, true),
	'schedule' : newTable(id, true)
}

exports.search = function(table, data, callback) {
	let result = Base[table].search(data[table]);
	callback(result);
}

exports.insert = function(table, data, callback) {
	let result = Base[table].insert(data[table]);
	console.log('result');
	console.log(result);
	callback(result);
}

exports.update = function(table, data, callback) {
	let result = Base[table].update(data[table]);
	callback(result);
}

exports.remove = function(table, data, callback) {
	let result = Base[table].remove(data[table]);
	callback(result);
}
