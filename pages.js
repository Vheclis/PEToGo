let pageManager = new SinglePageManager('index.html', '404.html');

$(document).ready(function() {
	pageManager.init();
	pageManager.bindFormSubmit();
	pageManager.bindARef('#contentBox');
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

pageManager.addPage('home.html');
pageManager.addPage('carrinho.html');
pageManager.addPage('estoque.html');
pageManager.addPage('storeLine.html', ['name', 'shortDescription', 'price']);
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
				//console.log(item);
				itemLine = $('<li/>').attr('id', 'product'+i);
				productList.append(itemLine);
				pageManager.renderIn(pageContent, '#product'+i, 'storeLine.html', item);
			}
			console.log(pageContent);
		},
		error: function (error){
		}
	})
});
pageManager.addPage('schedulePET.html');
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
