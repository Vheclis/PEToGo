curl -X DELETE http://127.0.0.1:5984/petogo


curl -X PUT http://127.0.0.1:5984/petogo

curl -X PUT http://127.0.0.1:5984/petogo/"Jeff" -d '{"typeDB": "user", "name" : "Jeff", "telephone": "(19)3533 - 3324", "email": "victor.heclis@usp.br", "address": "", "password" : "123", "type" : "admin" , "img":"https://goo.gl/8bgJ2f"}'
curl -X PUT http://127.0.0.1:5984/petogo/"Nilson" -d '{"typeDB": "user", "name" : "Nilson", "telephone": "(11)3431 - 3844", "email": "nilson.furquim@usp.br", "address": "USP", "password" : "1234", "type" : "client", "img":"https://goo.gl/SWdfhw"}'
	

curl -X PUT http://127.0.0.1:5984/petogo/"1" -d '{"typeDB": "product", "img":"img/wiskasgato.png", "name" : "whiskas", "shortDescription" : "Ração para gatos", "amount": 10 , "bigDescription":"Raaação para gaatos" , "price" : 49.90 }'
curl -X PUT http://127.0.0.1:5984/petogo/"2" -d '{"typeDB": "product", "img":"https://goo.gl/utWvYW", "name" : "pedrigree", "shortDescription" : "Ração para doggos", "amount": 10 , "bigDescription":"Raaação para dooogos" , "price" : 59.90 }'
curl -X PUT http://127.0.0.1:5984/petogo/"3" -d '{"typeDB": "product", "img":"https://goo.gl/utWvYW", "name" : "pedrigree2", "shortDescription" : "Ração para doggos2", "amount": 10 , "bigDescription":"Raaação para dooogos2" , "price" : 59.903 }'
curl -X PUT http://127.0.0.1:5984/petogo/"4" -d '{"typeDB": "product", "img":"https://goo.gl/utWvYW", "name" : "pedrigree3", "shortDescription" : "Ração para doggos3", "amount": 10 , "bigDescription":"Raaação para dooogos3" , "price" : 59.903 }'
curl -X PUT http://127.0.0.1:5984/petogo/"5" -d '{"typeDB": "product", "img":"https://goo.gl/utWvYW", "name" : "dogshow", "shortDescription" : "Ração para doggos shows", "amount": 10 , "bigDescription":"Raaação para dooogos4" , "price" : 109.90 }'

curl -X PUT http://127.0.0.1:5984/petogo/"6" -d '{"typeDB": "service", "username" : "", "date" : "2017-06-10", "time" : "18:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/petogo/"7" -d '{"typeDB": "service", "username" : "", "date" : "2017-06-10", "time" : "19:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/petogo/"8" -d '{"typeDB": "service", "username" : "", "date" : "2017-06-10", "time" : "16:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/petogo/"9" -d '{"typeDB": "service", "username" : "", "date" : "2017-06-10", "time" : "8:00", "type" : "Banho", "status" : "free"}'


curl -X PUT http://127.0.0.1:5984/petogo/"10" -d '{"typeDB": "pet", "owner":"Nilson", "img":"https://goo.gl/MHaQrr", "name":"Rex", "race":"dog1", "age": 9000 }'
curl -X PUT http://127.0.0.1:5984/petogo/"11" -d '{"typeDB": "pet", "owner":"Nilson", "img":"https://goo.gl/9z4iGk", "name":"Petro", "race":"cat", "age": 900 }'
curl -X PUT http://127.0.0.1:5984/petogo/"12" -d '{"typeDB": "pet", "owner":"Nilson", "img":"https://goo.gl/OUhXaQ", "name":"Tataluga", "race":"squirtle", "age": 90 }'

curl -X PUT http://127.0.0.1:5984/petogo/_design/docs --data-binary @doc_views.json
