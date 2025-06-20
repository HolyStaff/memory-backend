curl -X POST -H "Content-Type: application/json" -d '{"username":"Henk","password":"henk"}' localhost:8000/memory/login
echo \n
curl -X POST -H "Content-Type: application/json" -d '{"username":"1","password":"1"}' localhost:8000/memory/login