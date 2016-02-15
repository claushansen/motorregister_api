var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'));
 


app.get('/api', function(req,res){
res.send({apiname:'Motorregister API'})

})
 
app.listen(3000)