var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');
app.enable('strict routing');

var examples = fs.readdirSync(__dirname).filter(function(file) {
  return fs.statSync(__dirname + '/' + file).isDirectory();
});

app.get('/page.js', function(req, res){
  res.sendFile(join(__dirname, '../../node_modules/page', 'page.js'));
});

app.get(/^\/(mocha|chai)\.(css|js)$/i, function(req, res) {
  res.sendFile(join(__dirname, '../test/', req.params.join('.')));
});

app.get('/', function(req, res) {
  res.render('list', {examples: examples});
});

app.get('/:example', function(req, res) {
  res.redirect('/' + req.params.example + '/');
});

app.get('/:example/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.example;
  var path = join(__dirname, name, file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendFile(path);
  });
});

app.get('/:example/*', function(req, res){
  var name = req.params.example;
  res.sendFile(join(__dirname, name, 'index.html'));
});

app.listen(4000);
console.log('example server listening on port 4000');
