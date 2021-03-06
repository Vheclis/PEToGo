let pageManager = new SinglePageManager('index.html', '404.html');
var user = {'username' : ''};

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
pageManager.addPage('loginAdmin.html', ['img','username', 'id', 'telephone', 'email'], function (pageContent, data) {
    pageContent.find('#adminPhoto').attr("src",user.img);
    pageContent.find('#button-logoff').on("click", function (e) {
        user.username = '';
        user.type = '';
        $('#navName').text('USUÁRIO');
        pageManager.renderInDocument('#userBox', 'loginDefault.html');
        pageManager.renderInDocument('#contentBox','home.html');
    });
});

pageManager.addPage('loginClient.html', ['img','username', 'id', 'telephone', 'email', 'address'], function (pageContent, data) {
    pageContent.find('#clientPhoto').attr("src",user.img);
    pageContent.find('#logoff').on("click",function (e) {
        user.username = '';
        user.username = '';
        user.type = '';
        $('#navName').text('USUÁRIO');
        pageManager.renderInDocument('#userBox', 'loginDefault.html');
        pageManager.renderInDocument('#contentBox','home.html');
    });
});
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
		$('#navName').text(user.username);

	}
});

let toString = Object.prototype.toString;
let number = toString.call(1);
let string = toString.call('asdf');
function types(value) {
	if(toString.call(value) == number)
		return "number";
	if(toString.call(value) == string)
		return "text";
}
console.log(types);

function appendInput(page, prefix, name, value) {
	page.append('<label>'+name+'</label>');
	page.append('<input class="form-control" type="'+types(value)+'" name="'+prefix+'.'+name+'" value="'+value+'"/>');
}

pageManager.addPage('stem.html', [], function (pageContent, data) {
	console.log(data);
	pageContent.find(".stem-root").append("<form data-form-name="+data.name+"/>");
	let form = pageContent.find("[data-form-name="+data.name+"]");
	form.attr('action', data.action);
	form.attr('method', data.method);
	for(input in data.object) {
		let value = data.object[input];
		appendInput(form, prefix, input, value);
	}
	form.append('<input type="submit" value="'+data.submit+'"/>');
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

	pageContent.find('#button-buy').on('click',function (e) {
        pageManager.renderInDocument('#contentBox', 'pagamento.html');
    })
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
pageManager.addPage('pagamento.html',[],function (pageContent, data) {
    pageContent.find('#button-payment').on("click", function (e) {
        alert("Pagamento finalizado!");
    })
});


pageManager.addPage('detalheproduto.html', ['id', 'name', 'shortDescription', 'bigDescription', 'price'], function (pageContent, data){
    pageContent.find('#productPhoto').attr("src", data.img)
	pageContent.find("#add-to-cart").on('click', function (e) {
		let button = $(e.target);
		cart.addItem(data);
		alert("Produto adicionado ao carrinho");
		//console.log(cart.getItems());
	});

});

pageManager.addPage('storeLine.html', ['id', 'name', 'shortDescription', 'bigDescription' , 'price'], function(pageContent, product){
    pageContent.find('#storeImg').attr("src", product.img)
	pageContent.on('click', '.product-details', function(e){
		let button = $(this);
		let productSearch = "{ 'product' : {'id' : "+product.id+"}}";
		$.ajax ({
			url: "/product?id=" + product.id,
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
		url: "/products/20/0",
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

pageManager.addPage('stockLine.html', ['id', 'name', 'shortDescription', 'bigDescription' , 'price', 'amount', 'img'], function (pageContent, data) {
    pageContent.find("#stockLineAmount").attr("placeholder",data.amount);
    pageContent.find('#stockImg').attr("src",data.img);
    pageContent.find('#buttonChangeAmount').on("click", function (e) {
        let value = pageContent.find("#stockLineAmount").val();
        let obj = {'product' : { 'id' : data.id, 'amount' : value}};
        $.ajax ({
            url: "/update",
            data: JSON.stringify(obj),
            type: "POST",
            success: function (data) {
                alert("Alterado com Sucesso!");
            },
            error: function (error){
            }
        })
    })
});

pageManager.addPage('estoque.html', [], function (pageContent, data) {
	console.log("ops...");
    pageContent.find('#searchStock').on('input', function (e) {
        console.log("searching...");
        let input = $(this);
        let val = input.val();
        if (val != "") {
            pageContent.find('.stock-item').addClass('hidden');
            pageContent.find('[data-field="name"]:contains("'+val+'")').closest('.stock-item').removeClass('hidden');
            pageContent.find('[data-field="shortDescription"]:contains("'+val+'")').closest('.stock-item').removeClass('hidden');
        } else {
            pageContent.find('.stock-item').removeClass('hidden');
        }
    });

    $.ajax ({
	url: "/products/20/0",
        type: "GET",
        datatype: 'HTML',
        success: function (data) {
            let item;
            for(var i = 0; i < data.length; i++) {
                item = data[i];
                pageManager.renderInAppend(pageContent, '#stockList', 'stockLine.html', item);
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

pageManager.addPage('scheduleLine.html', [], function(pageContent, data) {
	pageContent.find('[name="service.username"]').val(data.username).attr('value', data.username);
	pageContent.find('[name="service.id"]').val(data._id).attr('value', data.id);
	pageContent.find('[name="service.type"]').val(data.type).attr('value', data.type);
	pageContent.find('[name="service.time"]').val(data.time).attr('value', data.time);
	if(user.username == '') {
		let submit = pageContent.find("input[type='submit']");
		submit.val("Faça login!");
		submit.attr('disabled', "");
	}
});

pageManager.addPage('schedulePET.html', ['day1', 'day2', 'day3', 'day4'], function(pageContent, data) {
	let buttonServType = 'Todos';
	let datePicker = pageContent.find('#serviceDate');
	datePicker.on('input', function (e) {
		let datePicker = $(e.target);
		let dateText = datePicker.val();
		let date = new Date(dateText);
		date.setDate(date.getDate() - 1);
		let url;
		for(let i = 1; i < 5; i++) {
			pageContent.find('#day'+i+'services').empty();
			pageContent.find('[data-field=day'+i+']').text(convertDate(date));
			url = '/service?status=free&date='+convertDate(date)+'&type='+buttonServType;
			$.ajax ({
				url: url,
				type: "GET",
				datatype: 'HTML',
				success: function (data) {
					let service;
					for(var j = 0; j < data.length; j++) {
						service = data[j].value;
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
		buttonServType = button.val();
		let query = button.val().toString();
		console.log(query);
		selectors.removeClass('active');
		button.addClass("active");
		if (button.val() == "Todos") {
			pageContent.find(".schedule-item").removeClass('hidden');
			return;
		} else {
			pageContent.find(".schedule-item").addClass('hidden');
			pageContent.find(".service-name[value="+query+"]").closest(".schedule-item").removeClass('hidden');
		}
	});
});

//Admin control


pageManager.addPage('adminCreateProduct.html');
pageManager.addFormCallback('formAdminCreateProduct', function (err, response) {
    if(err) {
        console.log("Insert error on Create Product");
        return;
    } else {
        alert("Produto inserido com sucesso");
    }

})
pageManager.addPage('adminCreateAdmin.html');
pageManager.addPage('adminCreateClient.html');
pageManager.addPage('adminCreateProduct.html');
pageManager.addPage('adminCreateService.html');

//Client control
pageManager.addPage('editClientProfile.html',user);
pageManager.addPage('petLine.html', ['img','name','race','age'], function (pageContent, data) {
    pageContent.find('#petImg').attr("src", data.img);
});
pageManager.addPage('petClient.html', [], function (pageContent, data) {
	pageContent.find('#ownerPET').attr('value', user.username);
    pageContent.find('#searchPet').on("input", function (e) {
        console.log("searching for PET...");
        let input = $(this);
        let val = input.val();
        if (val != "") {
            pageContent.find('.pet-item').addClass('hidden');
            pageContent.find('[data-field="name"]:contains("'+val+'")').closest('.pet-item').removeClass('hidden');
        } else {
            pageContent.find('.pet-item').removeClass('hidden');
        }

    });
    let url = "/pet/"+user.username;
    console.log(url);
    $.ajax ({
        url: url,
        type: "GET",
        datatype: 'HTML',
        success: function (data) {
            let item;
            for(var i = 0; i < data.rows.length; i++) {
                item = data.rows[i].value;
                pageManager.renderInAppend(pageContent, '#petList', 'petLine.html', item);
            }
        },
        error: function (error){
        }
    })
});
pageManager.addFormCallback('formCreatePET', function (err, response) {
    if(err){
        console.log("Error on creating the PET");
    } else {
        pageManager.renderInDocument('#contentBox','petClient.html');
    }
})
