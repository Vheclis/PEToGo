let pageManager = new SinglePageManager('index.html', '404.html');
let cart = new Cart('localStorage');

$(document).ready(function() {
	sessionStorage.cart = [];
	pageManager.init();
	pageManager.bindFormSubmit();
	pageManager.bindARef('#contentBox');
	pageManager.bindButtonRef('#contentBox');
	pageManager.addPage('home.html');
	pageManager.addPage('loginDefault.html');
	pageManager.render('#contentBox', 'home.html');
	pageManager.render('#userBox', 'loginDefault.html');
});

pageManager.addPage('loginAdmin.html', ['username']);
pageManager.addFormCallback('formLogin', function(err, response) {
	if(err) {
		console.log('Login error');
		return;
	} else {
		//console.log(response);
		pageManager.render('#userBox', 'loginAdmin.html', response);
	}
});

pageManager.addPage('carrinho.html', [], function (pageContent, data) {
	let items = cart.getItems();
	console.log(cart.getItems());
	let itemLine;
	let itemList = pageContent.find('#cart-list');
	itemList.empty();
	for(let i = 0; i < items.length; i++) {
		console.log("it" + i);
		item = items[i];
		itemLine = $('<li/>').attr('id', 'item-'+i);
		itemList.append(itemLine);
		pageManager.renderIn(pageContent, '#item-'+i, 'cartLine.html', item);
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
	//pageContent.find('.product-details').attr('data-product', data.id);
	pageContent.find('.product-details').on('click', function(e){
		let button = $(this);
		//let productId = button.attr('data-product');
		//if(productId != undefined && productId != ""){
		
			let productSearch = "{ 'product' : {'id' : "+product.id+"}}";
			$.ajax ({
				url: "/search/" + productSearch.replace(/['"]/g, "%22"),
				type: "GET",
				producttype: 'HTML',
				success: function (product) {
					pageManager.render('#contentBox', 'detalheproduto.html', product[0]);
				},
				error: function (error){
					console.log("Error getting product");
				}
			});
		//}
	});
});

pageManager.addPage('store.html', [], function (pageContent, data) {
	$.ajax ({
		url: "/search/{'product':{}}".replace(/['"]/g, "%22"),
		type: "GET",
		datatype: 'HTML',
		success: function (data) {
			let productList = pageContent.find('#productList');
			let itemLine;
			let item;
			for(var i = 0; i < data.length; i++) {
				item = data[i];
				itemLine = $('<li/>').attr('id', 'product'+i);
				productList.append(itemLine);
				pageManager.renderIn(pageContent, '#product'+i, 'storeLine.html', item);
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
