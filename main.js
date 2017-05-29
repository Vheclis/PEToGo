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
