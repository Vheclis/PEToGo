let SinglePageManager = function(index, notFound) {
	this.pages = {};
	this.index = index;
	this.notFound = notFound;
	this.pageExists = function (page) {
		if(this.pages[page] == undefined) {
			console.log("Error, page not set");
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

		let self = this;
		this.pages[page].renderFields = function (pageContent, data) {
			console.log(data);
			let fields = self.pages[page].fields;
			if(fields != undefined && fields.length > 0 && data != undefined) {
				for (var i = 0; i < fields.length; i++) {
					//console.log(fields[i] + ' = ' + data[fields[i]]);
					pageContent.find('#'+ fields[i]).html(data[fields[i]]);
				}
			}
		}
	}

	this.render = function (at, page, data) {
		if(!this.pageExists(page)) return;

		if(this.pages[page].content != undefined) {
			let pageContent = this.pages[page].content.clone();
			pageContent = this.pages[page].renderFields(pageContent, data);

			if(this.pages[page].render != undefined) {
				this.pages[page].render(pageContent, data);
			}

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

	this.bindARef = function (div, func) {
		$('a').on('click', function (e) {
			e.preventDefault();
			let pageRef = $(this).attr('href');
			if(call != undefined) {
				func(pageRef);
			} else {
				pageManager.render(div, pageRef);
			}
		})
	}

	this.addPage(index);
	this.addPage(notFound);
	return this;
};


