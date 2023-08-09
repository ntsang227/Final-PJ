const socketio = require('socket.io');
// In the Websocket class
class Websocket {
    constructor(httpServer) {
      this.io = socketio(httpServer);
      this.io.on('connection', (socket) => {
        console.log('A user has connected');
        socket.on('apply', (data) => {
          
          console.log('Received an apply request:',data);
          this.io.emit('apply-created', data);
        });
        socket.on('disconnect', () => {
          console.log('A user has disconnected');
          
        });
      });
    }
  
    static getInstance(httpServer = null) {
      if (!Websocket.instance) {
        Websocket.instance = new Websocket(httpServer);
       
      }
      return Websocket.instance;
    }
  }

module.exports = Websocket;
