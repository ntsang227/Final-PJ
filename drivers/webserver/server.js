/*var app = require('../../app.js');

var http = require('http');


var port = 3000;
app.set('port', port);


var server = http.createServer(app);

server.listen(port ,() => {
  console.log('Server running at port 3000');
});*/
var app = require('../../app.js');
var http = require('http');
var port = 3000;
app.set('port', port);

const server = http.createServer(app);
// Import the socket.io library
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.on('apply', (data) => {
    console.log('Received an apply request:', data);

    io.emit('apply-created', true);
  });
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

