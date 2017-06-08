let pageManager = new SinglePageManager('index.html', '404.html');

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
pageManager.addFormCallback('formLogin', function(err, user) {
	if(err) {
		console.log('Login error');
		return;
	} else {
		if(user.type == 'admin') {
			pageManager.renderInDocument('#userBox', 'loginAdmin.html', user);
		} else {
			pageManager.renderInDocument('#userBox', 'loginClient.html', user);
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
		pageManager.renderInAppend(pageContent, '#cart-list', 'cartLine.html', item);
	}
});
pageManager.addPage('cartLine.html', ['id', 'name', 'shortDescription', 'price'], function (pageContent, data) {
	pageManager.renderFields(pageContent, 'cartLine.html', data.item);
	pageContent.find('[name="quantity"]').val(data.quantity);
});

pageManager.addPage('detalheproduto.html', ['id', 'name', 'shortDescription', 'longDescription', 'price'], function (pageContent, data){
	pageContent.find("#add-to-cart").on('click', function (e) {
		let button = $(e.target);
		cart.addItem(data);
		console.log(cart.getItems());
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

pageManager.addPage('schedulePET.html');

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
function callPage(pageReference) {
    document.cookie = "page="+pageReference;

    $.ajax
    ({
        url: pageReference,
        type: "GET",
        datatype: 'HTML',
        success: function (response) {
            $('#contentBox').html(response);
        },
        error : function (error) {
            console.log('the page was not loaded')
        }
    })
}
