function Cart(persistency) {
	this.persistency = persistency;
	this.items = this.retrieve();
	if(!this.items) { this.items = []; };
}

Cart.prototype.storage = {
	'' : {
		'save' : function (name, items) {
			console.log('No store save method');
		},
		'clear' : function () {
			console.log('No store clear method');
		},
		'retrieve' : function () {
			console.log('No store retrieve method');
		}
	},
	'localStorage' : {
		'save' : function (name, items) {
			window.localStorage.setItem(name, JSON.stringify(items));
		},
		'clear' : function () {
			window.localStorage.clear();
		},
		'retrieve' : function () {
			return JSON.parse(window.localStorage.getItem(name, 'items'));
		}
	},
	'sessionStorage' : {
		'save' : function (name, items) {
			window.sessionStorage.setItem(name, JSON.stringify(items));
		},
		'clear' : function () {
			window.sessionStorage.clear();
		},
		'retrieve' : function () {
			return JSON.parse(window.session.getItem(name, 'items'));
		}
	}/*,
	'cookie' : function (name, items) {
	}*/
}

Cart.prototype.retrieve = function () {
	this.items = this.storage[this.persistency].retrieve();
}

Cart.prototype.clear = function () {
	this.storage[this.persistency].clear();
}

Cart.prototype.save = function () {
	this.storage[this.persistency].save('items', this.items);
}

Cart.prototype.addItem = function(item, quantity) {
	for (var i = 0; i < this.items.length; i++) {
		if(JSON.stringify(item) == JSON.stringify(this.items[i].item)) {
			this.items[i].quantity += quantity ||  1;
			this.save();
			return;
		}
	}

	this.items.push({'item' : item , 'quantity' : quantity || 1});
	this.save();
}

Cart.prototype.setQuantity = function(itempos, quantity) {
	//for (var i = 0; i < this.items.length; i++) {
	//	if(item == this.items[i]) {
	//		this.items[i].quantity = quantity;
	//		this.save();
	//		return;
	//	}
	//}
	if (itempos > this.items.length) {
		console.log("Cart Error: position invalid");
	}

	console.log("itempos" + itempos);
	this.items[itempos].quantity = quantity;
	console.log("Cart Error: setQuantity, item not found");
}

Cart.prototype.getItems = function() {
	return this.items;
}

Cart.prototype.calculateTotal = function() {
	let total = 0;
	let item;
	for (let i = 0; i < this.items.length; i++) {
		item = this.items[i];
		total += item.quantity * item.item.price;
	}
	return total;
}
