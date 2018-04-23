const express = require('express'),
app = express(),
http = require('http').Server(app),
debug = require('debug')('kager-server'),
handlebars  = require('express-handlebars'),
port = process.env.PORT || 3000;

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require('dotenv').config();

// Define directory from which static files are served
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/projects', function(req, res) {
    res.render('projects');
});




http.listen(port, function(){
    console.log('Server listening on port ' + port)
})