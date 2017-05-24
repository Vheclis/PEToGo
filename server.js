const port = 8001

var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.redirect('/index.html');
})

app.post('/login', function (req, res) {
	res.send('ok');
})

app.get('/form', function (req, res) {
	res.send('ok');
})

app.use(express.static(__dirname + '/'));

app.listen(8001, function () {
	console.log('Serving at ' + port);
})
