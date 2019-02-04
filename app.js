// Main server

var express = require('express');
var app = express();
var port = 3000;

app.listen(port, function(){
    console.log('Server is running on port:', port)
});

// Set up a routing
app.get('/', function(req, res){
    res.send('Hello Express');
})

// serving static files from serve
app.use(express.static('public'))