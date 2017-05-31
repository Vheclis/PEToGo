formCallback = {};

function sendForm(formId) {
	let form = $(formId);
	let method = form.attr('method') || 'POST';
	let action = form.attr('action') || '/' + formId;
	let target = form.attr('target');
	let type = form.attr('type') || 'html';
	let callback = formCallback[formId];

	let data = {
		'title' : formId,
		'message' : $(formId).serializeObject()
	};

	$.ajax({
		type: method,
		url: action,
		data: data,
		dataType : type,
		success: function (response) {
			console.log('success');
			if(callback != undefined) {
				callback(true, response);	
			} else {
				$(target).html(response);
			}
		},
		error: function (response) {
			console.log('error');
			if(callback != undefined) {
				callback(false, response);	
			} else {
				$(target).html(response);
			}
		}
	});
}

