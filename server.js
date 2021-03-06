'use strict';

var http = require('http'),
  connect = require('connect'),
  httpProxy = require('http-proxy'),
  transformerProxy = require('transformer-proxy');

//
// The transforming function.
//

var transformerFunction = function (data, req, res) {
  return data.toString().replace('var apiHost = "";', 'var apiHost = document.location.origin;').replace("</head>", "<style>.jim-well { display: none }</style></head>");
};


//
// A proxy as a basic connect app.
//

var proxyPort = process.env.PROXY_PORT || 8090;
var upstreamUrl = process.env.UPSTREAM_URL || 'http://localhost:8080';
var app = connect();
var proxy = httpProxy.createProxyServer({target: upstreamUrl});

app.use(transformerProxy(transformerFunction, {match : /^\/$/}));

app.use(function (req, res) {
  proxy.web(req, res);
});

var server = http.createServer(app);

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});


server.listen(proxyPort);

console.log('Listening on port ' + proxyPort);
console.log('Upstream is ' + upstreamUrl);