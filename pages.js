let pageManager = SinglePageManager('index.html', '404.html');

$(document).ready(function() {
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
pageManager.addPage('store.html');
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
//'storeProduct.html'
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
