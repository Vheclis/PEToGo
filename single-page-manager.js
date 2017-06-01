let SinglePageManager = function(index, notFound) {
	var self = this;
	this.pages = {};
	this.formCallback = {};
	this.eventBind = {};
	this.index = index;
	this.notFound = notFound;

	this.pageExists = function (page) {
		if(this.pages[page] == undefined) {
			console.log("Error, page '"+page+"' not set");
			return false;
		} else {
			return true;
		}
	}

	this.getPage = function (page, callback, args) {
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

	this.addPage = function (page, fields, render) {
		this.pages[page] = {
			'fields' : fields,
			'render' : render
		}

		this.pages[page].renderFields = function (pageContent, data) {
			let fields = self.pages[page].fields;
			if(fields != undefined && fields.length > 0 && data != undefined) {
				for (var i = 0; i < fields.length; i++) {
					//console.log(fields[i] + ' = ' + data[fields[i]]);
					pageContent.find('#'+ fields[i]).html(data[fields[i]]);
				}
			}
		}

		//console.log(page + " added");
	}

	this.render = function (at, page, data) {
		if(!this.pageExists(page)) return;

		if(this.pages[page].content != undefined) {
			let pageContent = this.pages[page].content.clone();

			if(this.pages[page].render != undefined) {
				this.pages[page].render(pageContent, data);
			}
			this.rebind(pageContent);

			let atjquery = $(at);
			if(atjquery) {
				atjquery.html(pageContent);
			}
			return;
		} else {
			getPage(page, function(response){
				let pageContent = $(response);
				this.pages[page].content = pageContent;
				this.pages[page].renderFields(pageContent, data);

				if(this.pages[page].render != undefined) {
					this.pages[page].render(pageContent, data);
				}
				this.rebind(pageContent);

				let atjquery = $(at);
				if(atjquery) {
					atjquery.html(pageContent);
				}
			});
		}

	};

	this.getAll = function() {
		for(page in this.pages) {
			getPage(page);
		}
	}


	this.sendForm = function (form) {
		console.log(form);
		let formId = form.attr('id');
		let method = form.attr('method') || 'POST';
		let action = form.attr('action') || '/' + formId;
		//let type = form.attr('type') || 'application/json';
		let callback = this.formCallback[formId];

		data = form.serializeObject();
		//let data = {
		//	'title' : formId,
		//	'message' : $(formId).serializeObject()
		//};

		console.log('data to send:');
		console.log(data);
		$.ajax({
			type: method,
			url: action,
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

	this.addFormCallback = function(id, callback) {
		this.formCallback[id] = callback;
	}

	this.bindFormSubmit = function (func, page) {
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

	this.bindButtonRef = function (div, func, page) {
		if (this.eventBind.button == undefined) {
			this.eventBind['button'] = {
				'target' : div,
				'function' : func
			}
		}
		let button;
		if(page != undefined) {
			button = page.find('button');
		} else {
			button = $('button');
		}
		button.on('click', function(e) {
			if(this.is("[href]")) {
				e.preventDefault();
				let pageRef = this.arr('href');
				if(func != undefined) {
					func(div, pageRef);
				} else {
					pageManager.render(div, pageRef);
				}
			}
		});
	}

	this.bindARef = function (div, func, page) {
		if(this.eventBind.a == undefined) {
			this.eventBind['a'] = {
				'target' : div,
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
				func(div, pageRef);
			} else {
				pageManager.render(div, pageRef);
			}
		});
	}

	this.rebind = function(page) {
		formBind = this.eventBind.form;
		buttonBind = this.eventBind.button;
		aBind = this.eventBind.a;
		if(formBind != undefined) {
			bindFormSubmit(formBind.func, page);
		}
		if(buttonBind != undefined) {
			bindButtonRef(buttonBind.div, buttonBind.func, page);
		}
		if(aBind != undefined) {
			bindARef(aBind.div, aBind.func, page);
		}
	}

	this.addPage(index);
	this.addPage(notFound);
	return this;
};


