const express = require('express'),
app = express(),
http = require('http').Server(app),
debug = require('debug')('kager-server'),
handlebars  = require('express-handlebars'),
config = require("./config"),
port = config.portgit ;

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Define directory from which static files are served
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/projects', function(req, res) {
    res.render('projects');
});

// app.get('/project-detail', function(req, res) {
//     res.render('project-detail');
// });





http.listen(port, function(){
    console.log('Server listening on port ' + port)
})