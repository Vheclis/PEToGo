$('a').on('click', function (e) {
    e.preventDefault();
    var pageRef = $(this).attr('href');

    callPageA(pageRef);
})


function callPageA(pageReference) {
    $.ajax
    ({
        url: pageReference,
        type: "GET",
        datatype: 'HTML',
        success: function (response) {
            $('#content').html($(response).filter('#content'));
        },
        error : function (error) {
            console.log('the page was not loaded')
        }
    })

}
