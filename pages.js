let pageManager = new SinglePageManager('index.html', '404.html');
let user = {'username' : ''};
$(document).ready(function() {
	sessionStorage.cart = [];
	pageManager.init();
	pageManager.bindFormSubmit();
	pageManager.bindARef('#contentBox');
	pageManager.bindButtonRef('#contentBox');
	pageManager.addPage('home.html');
	pageManager.addPage('loginDefault.html');
	pageManager.renderInDocument('#contentBox', 'home.html');
	pageManager.renderInDocument('#userBox', 'loginDefault.html');
});

//Login
pageManager.addPage('loginAdmin.html', ['username']);
pageManager.addPage('loginClient.html', ['username']);
pageManager.addFormCallback('formLogin', function(err, response) {
	if(err) {
		console.log('Login error');
		return;
	} else {
		user = response;
		if(user.type == 'admin') {
			pageManager.renderInDocument('#userBox', 'loginAdmin.html', response);
		} else {
			pageManager.renderInDocument('#userBox', 'loginClient.html', response);
		}
	}
});

//Cart
let cart = new Cart('localStorage');
pageManager.addPage('carrinho.html', [], function (pageContent, data) {
	let items = cart.getItems();
	console.log(cart.getItems());
	for(let i = 0; i < items.length; i++) {
		item = items[i];
		item.item.cartid = i;
		pageManager.renderInAppend(pageContent, '#cart-list', 'cartLine.html', item);
	}

	let total = cart.calculateTotal();
	pageContent.find('#cart-total').text(total);
	if(user.username == '') {
		let submit = pageContent.find('#button-buy');
		submit.text("Faça login!");
		submit.attr('disabled', "");
	}
		
});
pageManager.addPage('cartLine.html', ['cartid', 'id', 'name', 'shortDescription', 'price'], function (pageContent, data) {
	console.log(data.item);
	pageManager.renderFields(pageContent, 'cartLine.html', data.item);
	pageContent.find('[data-cart-id]').attr('data-cart-id', data.item.cartid);
	pageContent.find('[name="quantity"]').val(data.quantity);

	pageContent.find('.cart-item-quantity').on('input', function(e) {
		let input = $(e.target);
		let cartId = input.attr('data-cart-id');
		let quantity = input.val();
		cart.setQuantity(cartId, quantity);

		let total = cart.calculateTotal();
		$('#cart-total').text(total);
	});
});

pageManager.addPage('detalheproduto.html', ['id', 'name', 'shortDescription', 'longDescription', 'price'], function (pageContent, data){
	pageContent.find("#add-to-cart").on('click', function (e) {
		let button = $(e.target);
		cart.addItem(data);
		//console.log(cart.getItems());
	});

});

pageManager.addPage('storeLine.html', ['id', 'name', 'shortDescription', 'price'], function(pageContent, product){
	pageContent.on('click', '.product-details', function(e){
		let button = $(this);
		let productSearch = "{ 'product' : {'id' : "+product.id+"}}";
		$.ajax ({
			url: "/search/" + productSearch.replace(/['"]/g, "%22"),
			type: "GET",
			producttype: 'HTML',
			success: function (product) {
				pageManager.renderInDocument('#contentBox', 'detalheproduto.html', product[0]);
			},
			error: function (error){
				console.log("Error getting product");
			}
		});
	});
});

pageManager.addPage('store.html', [], function (pageContent, data) {
	pageContent.find('#searchStore').on('input', function (e) {
		console.log("searching...");
		let input = $(this);
		let val = input.val();
		if (val != "") {
			pageContent.find('.store-item').addClass('hidden');
			pageContent.find('[data-field="name"]:contains("'+val+'")').closest('.store-item').removeClass('hidden');
			pageContent.find('[data-field="shortDescription"]:contains("'+val+'")').closest('.store-item').removeClass('hidden');
		} else {
			pageContent.find('.store-item').removeClass('hidden');
		}
	});

	$.ajax ({
		url: "/search/{'product':{}}".replace(/['"]/g, "%22"),
		type: "GET",
		datatype: 'HTML',
		success: function (data) {
			let item;
			for(var i = 0; i < data.length; i++) {
				item = data[i];
				pageManager.renderInAppend(pageContent, '#productList', 'storeLine.html', item);
			}
		},
		error: function (error){
		}
	})
});

function convertDate(date) {
	var day = ("0" + date.getDate()).slice(-2);
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var today = date.getFullYear()+"-"+(month)+"-"+(day) ;
	return today;
}
pageManager.addPage('schedulePET.html', ['day1', 'day2', 'day3', 'day4'], function(pageContent, data) {
	let datePicker = pageContent.find('#serviceDate');
	datePicker.on('input', function (e) {
		let datePicker = $(e.target);
		let dateText = datePicker.val();
		let date = new Date(dateText);
		date.setDate(date.getDate() - 1);
		let url;
		for(let i = 1; i < 5; i++) {
			console.log(date);
			pageContent.find('#day'+i+'services').empty();
			pageContent.find('[data-field=day'+i+']').text(convertDate(date));
			url = '/search/{"service":{"status":"free","date":"'+convertDate(date)+'"}}';
			$.ajax ({
				url: url,
				type: "GET",
				datatype: 'HTML',
				success: function (data) {
					let service;
					for(var j = 0; j < data.length; j++) {
						service = data[j];
						service.username = user.username;
						pageManager.renderInAppend(pageContent, '#day'+i+'services', 'scheduleLine.html', service);
					}
				},
				error: function (error){
				}
			});
			date.setDate(date.getDate() + 1);
		}
	});
	var now = new Date();
	datePicker.val(convertDate(now));
	datePicker.trigger('input');

	let selectors = pageContent.find('.service-type-selector')
	selectors.on('click', function(e) {
		let button = $(e.target);
		let query = button.text();
		selectors.removeClass('active');
		button.addClass("active");
		if (button.val() == "todos") {
			pageContent.find(".schedule-item").removeClass('hidden');
			return;
		} else {
			pageContent.find(".schedule-item").addClass('hidden');
			pageContent.find(".service-name[value="+query+"]").closest(".schedule-item").removeClass('hidden');
		}
	});
});

pageManager.addPage('scheduleLine.html', [], function(pageContent, data) {
	pageContent.find('[name="service.name"]').val(data.username).attr('value', data.username);
	pageContent.find('[name="service.type"]').val(data.type).attr('value', data.type);
	pageContent.find('[name="service.time"]').val(data.time).attr('value', data.time);
	if(user.username == '') {
		let submit = pageContent.find("input[type='submit']");
		submit.val("Faça login!");
		submit.attr('disabled', "");
	}
});
//Admin control
pageManager.addPage('adminCreateProduct.html');
pageManager.addPage('estoque.html');
//'adminCreateAdmin.html'
//'adminCreateClient.html'
//'adminCreateProduct.html'
//'adminCreateService.html'
//'adminEditar.html'
//'adminMain.html'
//'adminServices.html'
//'carrinho.html'
//'createPET.html'
//'detalheProduto.html'
//'editClientProfile.html'
//'estoque.html'
//'home.html'
//'loginAdmin.html'
//'loginClient.html'
//'loginDefault.html'
//'pagamento.html'
//'petClient.html'
//'schedulePET.html'
//'store.html'
//'storeLine.html'
