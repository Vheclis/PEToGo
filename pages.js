let pageManager = SinglePageManager('index.html', '404.html');

$(document).ready(function() {
	pageManager.bindARef('#contentBox');
	pageManager.addPage('home.html');
	pageManager.addPage('loginDefault.html');
	pageManager.render('#contentBox', 'home.html');
	pageManager.render('#userBox', 'loginDefault.html');
});

pageManager.addPage('loginAdmin.html', ['username']);
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
