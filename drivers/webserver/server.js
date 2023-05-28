var app = require('../../app.js');

//var app = require('../../index.js');

var http = require('http');


var port = 5000;
app.set('port', port);


var server = http.createServer(app);

server.listen(port ,() => {
  console.log('Database server, Admin client and User client are running at port 3000');
});
