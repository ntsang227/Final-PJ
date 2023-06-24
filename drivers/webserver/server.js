var app = require('../../app.js');

var http = require('http');


var port = 3000;
app.set('port', port);


var server = http.createServer(app);

server.listen(port ,() => {
  console.log('Server running at port 3000');
});
