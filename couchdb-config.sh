curl -X DELETE http://127.0.0.1:5984/user
curl -X DELETE http://127.0.0.1:5984/product
curl -X DELETE http://127.0.0.1:5984/service
curl -X DELETE http://127.0.0.1:5984/pet
curl -X DELETE http://127.0.0.1:5984/buy
curl -X DELETE http://127.0.0.1:5984/offers

curl -X PUT http://127.0.0.1:5984/user
curl -X PUT http://127.0.0.1:5984/product
curl -X PUT http://127.0.0.1:5984/service
curl -X PUT http://127.0.0.1:5984/pet
curl -X PUT http://127.0.0.1:5984/buy
curl -X PUT http://127.0.0.1:5984/offers

curl -X PUT http://127.0.0.1:5984/user/"01" -d '{"telephone": "(19)3533 - 3324", "email": "victor.heclis@usp.br", "address": "", "username" : "Jeff", "password" : "123", "type" : "admin" , "img":"https://goo.gl/8bgJ2f"}'
curl -X PUT http://127.0.0.1:5984/user/"02" -d '{"telephone": "(11)3431 - 3844", "email": "nilson.furquim@usp.br", "address": "USP", "username" : "Nilson", "password" : "1234", "type" : "client", "img":"https://goo.gl/SWdfhw"}'
	

curl -X PUT http://127.0.0.1:5984/product/"0001" -d '{"img":"img/wiskasgato.png", "name" : "whiskas", "shortDescription" : "Ração para gatos", "amount": 10 , "bigDescription":"Raaação para gaatos" , "price" : 49.90 }'
curl -X PUT http://127.0.0.1:5984/product/"0002" -d '{"img":"https://goo.gl/utWvYW", "name" : "pedrigree", "shortDescription" : "Ração para doggos", "amount": 10 , "bigDescription":"Raaação para dooogos" , "price" : 59.90 }'
curl -X PUT http://127.0.0.1:5984/product/"0003" -d '{"img":"https://goo.gl/utWvYW", "name" : "pedrigree2", "shortDescription" : "Ração para doggos2", "amount": 10 , "bigDescription":"Raaação para dooogos2" , "price" : 59.903 }'
curl -X PUT http://127.0.0.1:5984/product/"0004" -d '{"img":"https://goo.gl/utWvYW", "name" : "pedrigree3", "shortDescription" : "Ração para doggos3", "amount": 10 , "bigDescription":"Raaação para dooogos3" , "price" : 59.903 }'
curl -X PUT http://127.0.0.1:5984/product/"0005" -d '{"img":"https://goo.gl/utWvYW", "name" : "dogshow", "shortDescription" : "Ração para doggos shows", "amount": 10 , "bigDescription":"Raaação para dooogos4" , "price" : 109.90 }'

curl -X PUT http://127.0.0.1:5984/service/"0001" -d '{"username" : "", "type" : "Banho", "date" : "2017-06-10", "time" : "18:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/service/"0002" -d '{"username" : "", "type" : "Banho", "date" : "2017-06-10", "time" : "19:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/service/"0003" -d '{"username" : "", "type" : "Banho", "date" : "2017-06-10", "time" : "16:00", "type" : "Banho", "status" : "free"}'
curl -X PUT http://127.0.0.1:5984/service/"0004" -d '{"username" : "", "type" : "Banho", "date" : "2017-06-10", "time" : "8:00", "type" : "Banho", "status" : "free"}'


curl -X PUT http://127.0.0.1:5984/pet/"0001" -d '{"owner":"02", "img":"https://goo.gl/MHaQrr", "name":"Rex", "race":"dog1", "age": 9000 }'
curl -X PUT http://127.0.0.1:5984/pet/"0002" -d '{"owner":"02", "img":"https://goo.gl/9z4iGk", "name":"Petro", "race":"cat", "age": 900 }'
curl -X PUT http://127.0.0.1:5984/pet/"0003" -d '{"owner":"02", "img":"https://goo.gl/OUhXaQ", "name":"Tataluga", "race":"squirtle", "age": 90 }'
