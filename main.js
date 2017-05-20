var user = 0;  /*Login é escolhido como padrão*/


function init()
{
    $.ajax
    ({
        url: 'home.html',
        type: "GET",
        datatype: 'HTML',
        success: function (response) {
            $('#contentBox').html(response);
        },
        error : function (error) {
            console.log('the page was not loaded')
        }
    })

    $.ajax
        ({
            url: 'loginDefault.html',
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

$('a').on('click', function (e) {
    e.preventDefault();
    var pageRef = $(this).attr('href');

    callPage(pageRef);
})




function callPage(pageReference) {
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
    var user = document.getElementById('userName').value;
    var password = document.getElementById('userPass').value;

    if(user == "Nilson" & password == '1234')
    {
        document.getElementById('navName').innerHTML = "NILSON";
        user = 1;
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
        user = 2;
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