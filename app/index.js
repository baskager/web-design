const express = require('express'),
app = express(),
http = require('http').Server(app),
debug = require('debug')('kager-server'),
port = process.env.PORT || 3000;

require('dotenv').config();

// Define directory from which static files are served
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function(){
    console.log('Server listening on port ' + port)
})