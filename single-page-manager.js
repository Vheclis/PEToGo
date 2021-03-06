function SinglePageManager(index, notFound) {
	this.pages = {};
	this.formCallback = {};
	this.eventBind = {};
	this.index = index;
	this.notFound = notFound;
}

SinglePageManager.prototype.pageExists = function (page) {
	if(this.pages[page] == undefined) {
		console.log("Error, page '"+page+"' not set");
		return false;
	} else {
		return true;
	}
}

SinglePageManager.prototype.getPage = function (page, callback, args) {
	if (!this.pageExists(page)) return;
	let thisPage = this.pages[page];
	$.ajax ({
		url: page,
		type: "GET",
		datatype: 'HTML',
		success: function (data) {
			thisPage.content = $(data);
			callback(data);
		},
		error: function (error){
			console.log("Page not found")
			callback(error);
		}
	})
}

SinglePageManager.prototype.renderFields = function (pageContent, page, data) {
	if(page == undefined) {
		return;
	}

	let fields = this.pages[page].fields;
	if(fields != undefined && fields.length > 0 && data != undefined) {
		for (var i = 0; i < fields.length; i++) {
			console.log(fields[i] + ' = ' + data[fields[i]]);
			pageContent.find('[data-field='+ fields[i]+']').html(data[fields[i]]);
		}
	}
}

SinglePageManager.prototype.addPage = function (page, fields, render) {
	if(this.pages[page] != undefined) {
		console.log("page "+page+" already added, overloading.");
	}
	this.pages[page] = {
		'fields' : fields,
		'render' : render
	}
	//console.log(page + " added");
}

SinglePageManager.prototype.render = function (page, data, callback) {
	if(!this.pageExists(page)) return;

	if(this.pages[page].content != undefined) {
		let pageContent = this.pages[page].content.clone();

		this.renderFields(pageContent, page, data);
		this.rebind(pageContent);
		if(this.pages[page].render != undefined) {
			this.pages[page].render(pageContent, data);
		}

		callback(pageContent, data);
		return;
	} else {
		self = this;
		this.getPage(page, function(response){
			let pageContent = $(response);
			if(page == 'estoque.html') {
				console.log(self.pages[page]);
			}
			self.pages[page].content = pageContent.clone();
			self.renderFields(pageContent, page, data);

			self.rebind(pageContent);
			if(self.pages[page].render != undefined) {
				self.pages[page].render(pageContent, data);
			}
			callback(pageContent, data);
		});
	}
}
SinglePageManager.prototype.renderIn = function (pageIn, at, page, data) {
	this.render(page, data, function(pageContent, data) {
		let atjquery = $(pageIn).find(at);
		if(atjquery) {
			atjquery.html(pageContent);
		}
	});
}

SinglePageManager.prototype.renderInAppend = function (pageIn, at, page, data) {
	this.render(page, data, function(pageContent, data) {
		let atjquery = $(pageIn).find(at);
		if(atjquery) {
			atjquery.append(pageContent);
		}
	});
}

SinglePageManager.prototype.renderInDocument = function (at, page, data) {
	this.renderIn($(document), at, page, data);
}

SinglePageManager.prototype.getAll = function() {
	for(page in this.pages) {
		getPage(page);
	}
}


SinglePageManager.prototype.sendForm = function (form) {
	console.log(form);
	let formId = form.attr('data-form-name');
	let method = form.attr('method').toUpperCase() || 'POST';
	let url = form.attr('action') || '/' + formId;
	//let type = form.attr('type') || 'application/json';
	let callback = this.formCallback[formId];

	if(method == 'GET') {
		url = url + '/' + $.param(form.serialize());
		console.log(url);
	} else {
		data = form.serializeObject();
	}
	//let data = {
	//	'title' : formId,
	//	'message' : $(formId).serializeObject()
	//};

	//console.log('data to send:');
	//console.log(data);
	$.ajax({
		type: method,
		url: url,
		data: data,
		//dataType: 'json',
		//contentType : 'application/json;charset=utf-8',
		success: function (response) {
			console.log('sendForm ' + formId + ': success');
			if(callback != undefined) {
				callback(false, response);
			} else {
				console.log('No callback defined for '+formId);
			}
		},
		error: function (response) {
			console.log('sendForm ' + formId + ': error');
			if(callback != undefined) {
				callback(true, response);
			} else {
				console.log('No callback defined for '+formId);
			}
		}
	});
}

SinglePageManager.prototype.addFormCallback = function(id, callback) {
	this.formCallback[id] = callback;
}

SinglePageManager.prototype.bindFormSubmit = function (func, page) {
	if(this.eventBind.form == undefined) {
		this.eventBind['form'] = {
			'function' : func
		}
	}
	let form;
	if(page != undefined) {
		form = page.find('form');
	} else {
		form = $('form');
	}

	form.on('submit', function(e) {
		e.preventDefault();
		if(func != undefined) {
			func($(e.target));
		} else {
			self.sendForm($(e.target));
		}
		return false;
	});
}

SinglePageManager.prototype.bindButtonRef = function (defaultTarget, func, page) {
	if (this.eventBind.button == undefined) {
		this.eventBind['button'] = {
			'defaultTarget' : defaultTarget,
			'function' : func
		}
	}
	let doc;
	if(page != undefined) {
		doc = page;
	} else {
		doc = $(document);
	}
	doc.on('click', 'button', function(e) {
		//let button = $(e.defaultTarget);
		//console.log(button);
		//if (!button.is('button')) {
			let button = $(e.target).closest('button');
		//}
		if(button.is("[href]")) {
			e.preventDefault();
			let target = button.attr('target');
			let pageRef = button.attr('href');
			if(func != undefined) {
				func(target || defaultTarget, pageRef);
			} else {
				pageManager.renderInDocument(target || defaultTarget, pageRef);
			}
		}
		if(button.is('button-logoff')) {
		    user.username == '';
            pageManager.renderInDocument('#userBox', 'loginDefault.html');
        }
	});
}

SinglePageManager.prototype.bindARef = function (target, func, page) {
	if(this.eventBind.a == undefined) {
		this.eventBind['a'] = {
			'target' : target,
			'function' : func
		}
	}
	let a;
	if(page != undefined) {
		a = page.find('a');
	} else {
		a = $('a');
	}
	a.on('click', function (e) {
		e.preventDefault();
		let pageRef = $(this).attr('href');
		if(func != undefined) {
			func(target, pageRef);
		} else {
			pageManager.renderInDocument(target, pageRef);
		}
	});
}

SinglePageManager.prototype.rebind = function(page) {
	formBind = this.eventBind.form;
	buttonBind = this.eventBind.button;
	aBind = this.eventBind.a;
	if(formBind != undefined) {
		this.bindFormSubmit(formBind.func, page);
	}
	if(buttonBind != undefined) {
		this.bindButtonRef(buttonBind.target, buttonBind.func, page);
	}
	if(aBind != undefined) {
		this.bindARef(aBind.target, aBind.func, page);
	}
}

SinglePageManager.prototype.init = function() {
	this.addPage(this.index);
	this.addPage(this.notFound);
}
