$(document).ready(initDB());

function initDB()
{
    const dadosCliente = 
    [
        {ID: 1, User: "Niltom Furquim", Endereco: "USP, Laboratório 05", Telefone: "(66) 1234-5678", Email: "niltom.furquim@unesp.lorena.br"},
        {ID: 2, User: "John", Endereco: "Av. Episcopal", Telefone: "(19) 2343-2345", Email: "johndoe@gmail.com"}
    ];

    const dadosAdm = 
    [
        {ID: 1, User: "Jeff", Telefon: "(00) 0000-0000", Email: "victor.heclis@usp.br"},
        {ID: 2, User: "Salx", Telefon: "(00) 0000-0000", Email: "salx@usp.br"}
    ];

    const dadosServicos = 
    [
        {ID: 1, Nome: "Tosa", Horário: "11:00", Data: "29/05" ,Local: "Jardim Luftalla", Preco: 320},
        {ID: 2, Nome: "Tosa", Horário: "12:00", Data: "29/05" ,Local: "Jardim Luftalla", Preco: 320},
        {ID: 3, Nome: "Tosa", Horário: "18:00", Data: "29/05" ,Local: "Jardim Luftalla", Preco: 320},
        {ID: 4, Nome: "Banho", Horário: "10:00", Data: "29/05" ,Local: "Centro", Preco: 250},
        {ID: 5, Nome: "Banho", Horário: "11:00", Data: "29/05" ,Local: "Centro", Preco: 250},
        {ID: 6, Nome: "Banho", Horário: "19:00", Data: "29/05" ,Local: "Centro", Preco: 250},
        {ID: 7, Nome: "Passeio", Horário: "10:00", Data: "29/05" ,Local: "Centro", Preco: 400},
        {ID: 8, Nome: "Passeio", Horário: "11:00", Data: "29/05" ,Local: "Centro", Preco: 400},
        {ID: 9, Nome: "Passeio", Horário: "12:00", Data: "29/05" ,Local: "Centro", Preco: 400}
    ];

    const dadosProdutos =
    [
        {ID: 1, Nome: "Ração Golden Sênior (Cães)", Descricao: "Exemplo de descrição do produto 'Ração Golden Sênior (Cães)'", 
        ImgCaminho: "img/premieregolden.png", Preco: 109.90},
        {ID: 2, Nome: "Ração para gato", Descricao: "Exemplo de descrição do produto 'Ração para gato'", 
        ImgCaminho: "img/wiskasgato.png", Preco: 120.90},
        {ID: 3, Nome: "Comida para peixe", Descricao: "Exemplo de descrição do produto 'Comida para peixe'",
        ImgCaminho: "img/comidapeixe.png", Preco: 300}
    ];

    let request = indexedDB.open("PeToGo", 2);

    request.onerror = function(event)
    {
        alert("Database error: " + event.target.errorCode);
    };

    request.onupgradeneeded = function(event)
    {
        let db = event.target.result;

        let objectStore1 = db.createObjectStore("clientes", { keypath: "ID"});
        objectStore1.createIndex("User", "User", {unique : true});
        objectStore1.createIndex("Email", "Email", {unique : true});

        objectStore1.transaction.oncomplete = function(event)
        {
            let clientesObjectStore = db.transaction("PeToGo", "readwrite").objectStore1("clientes");
            for( let i in dadosCliente)
            {
                clientesObjectStore.add(dadosCliente[i]);
            }
        }

        let objectStore2 = db.createObjectStore("adms", { keypath: "ID"});
        objectStore2.createIndex("User", "User", {unique : true});
        objectStore2.createIndex("Email", "Email", {unique : true});        

        objectStore2.transaction.oncomplete = function(event)
        {
            let admsObjectStore = db.transaction("PeToGo", "readwrite").objectStore2("adms");
            for( let i in dadosAdm)
            {
                admsObjectStore.add(dadosAdm[i]);
            }
        }




        let objectStore3 = db.createObjectStore("servicos", { keypath: "ID"});
        objectStore3.createIndex("Nome", "Nome", {unique : false});
        objectStore3.createIndex("Data", "Data", {unique : false});
        
        objectStore3.transaction.oncomplete = function(event)
        {
            let servicosObjectStore = db.transaction("PeToGo", "readwrite").objectStore3("servicos");
            for( let i in dadosServicos)
            {
                servicosObjectStore.add(dadosServicos[i]);
            }
        }

        let objectStore4 = db.createObjectStore("produtos", { keypath: "ID"});
        objectStore4.createIndex("Nome", "Nome", {unique : false});
        
        objectStore4.transaction.oncomplete = function(event)
        {
            let produtosObjectStore = db.transaction("PeToGo", "readwrite").objectStore4("produtos");
            for( let i in dadosProdutos)
            {
                produtosObjectStore.add(dadosProdutos[i]);
            }
        }
    };
}




function init()
{

    let auxUrl;
    auxUrl = getCookie("page");
    if(auxUrl == "")
    {
        auxUrl = 'home.html';
    }
   /*Login é escolhido como padrão*/
   $.ajax
    ({
        url: auxUrl,
        type: "GET",
        datatype: 'HTML',
        success: function (response) {
            $('#contentBox').html(response);
        },
        error: function (error) {
            console.log('the page was not loaded')
        }
    });

    if (getCookie("user") == 1)
    {
        auxUrl = 'loginClient.html'
    }
    else if (getCookie("user") == 2)
    {
        auxUrl = 'loginAdmin.html'
    }
    else
    {
        auxUrl = 'loginDefault.html'
    }
    $.ajax
    ({
        url: auxUrl,
        type: "GET",
        datatype: 'HTML',
        success: function (response) {
            $('#userBox').html(response);
        },
        error: function (erro) {
            console.log("the user was not loaded")
        }})
}

$('a').on('click', function (e) {
    e.preventDefault();
    let pageRef = $(this).attr('href');

    callPage(pageRef);
})


function getCookie(fname)
{
    let name = fname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}

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

function login()
{

    let user = document.getElementById('userName').value;
    let password = document.getElementById('userPass').value;

    if(user == "Nilson" & password == '1234')
    {
        document.getElementById('navName').innerHTML = "NILSON";
        document.cookie = "user=1";

        $.ajax
        ({
            url: 'loginClient.html',
            type: "GET",
            datatype: 'HTML',
            success: function (response) {
                $('#userBox').html(response);
            },
            error: function (erro)
            {
                console.log("the user was not loaded")
            }

        })
    }

    if(user == "Jeff" & password == '1234')
    {
        document.getElementById('navName').innerHTML = "JEFF";
        document.cookie = "user=2";

        $.ajax
        ({
            url: 'loginAdmin.html',
            type: "GET",
            datatype: 'HTML',
            success: function (response) {
                $('#userBox').html(response);
            },
            error: function (erro)
            {
                console.log("the user was not loaded")
            }

        })
    }

}

function logoff()
{
    document.cookie = "user=0";
    document.cookie = "page=home.html"
    init();
}
