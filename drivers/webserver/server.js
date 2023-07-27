/*var app = require('../../app.js');

var http = require('http');


var port = 3000;
app.set('port', port);


var server = http.createServer(app);

server.listen(port ,() => {
  console.log('Server running at port 3000');
});*/
const app = require('../../app.js');
const Websocket = require('./websocket.js');
const http = require('http');
const port = 3000;
app.set('port', port);
const server = http.createServer(app);


const websocket = Websocket.getInstance(server); // Get the instance of Websocket


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
