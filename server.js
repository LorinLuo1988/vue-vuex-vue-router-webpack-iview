var express = require('express');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var STATIC_PATH = path.resolve(ROOT_PATH, 'dist');

var app = express();

app.get('/', function(req, res) {
	res.sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

app.use(express.static(STATIC_PATH)); //静态资源加载路径

app.set('port', process.env.PORT || 3000);

app.get('*', function(req, res) { //静态资源请求不会走此路径
	res.sendFile(path.resolve(STATIC_PATH, 'index.html'));
});

var server = app.listen(app.get('port'), function() {
	console.log("server start success, port is " + app.get('port'));
});
