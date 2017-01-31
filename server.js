'use strict';

var http = require('http'),
  connect = require('connect'),
  httpProxy = require('http-proxy'),
  transformerProxy = require('transformer-proxy');

//
// The transforming function.
//

var transformerFunction = function (data, req, res) {
  return data.toString().replace('var apiHost = "";', 'var apiHost = document.location.href;');
};


//
// A proxy as a basic connect app.
//

var proxyPort = process.env.PROXY_PORT || 8080;
var upstream = process.env.UPSTREAM_URL || 'http://localhost:8080';
var app = connect();
var proxy = httpProxy.createProxyServer({target: upstream});

app.use(transformerProxy(transformerFunction));

app.use(function (req, res) {
  proxy.web(req, res);
});

http.createServer(app).listen(proxyPort);

console.log('Listening on port ', proxyPort);
console.log('Upstream is ' + UPSTREAM_URL');