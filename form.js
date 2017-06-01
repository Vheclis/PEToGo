formCallback = {};

function sendForm(formId) {
	let form = $(formId);
	let method = form.attr('method') || 'POST';
	let action = form.attr('action') || '/' + formId;
	let target = form.attr('target');
	//let type = form.attr('type') || 'application/json';
	let callback = formCallback[formId];

	let data = {
		'title' : formId,
		'message' : $(formId).serializeObject()
	};

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
			callback(false, response);	
		},
		error: function (response) {
			console.log('sendForm ' + formId + ': error');
			callback(true, response);	
		}
	});
}

formCallback['#formLogin'] = function(err, response) {
	if(err) {
		console.log('Login error');
		return;
	} else {
		//console.log(response);
		pageManager.render('#userBox', 'loginAdmin.html', response);
	}
}
