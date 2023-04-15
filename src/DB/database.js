const mongoose = require('mongoose');

// Replace 'localhost' with your MongoDB hostname or IP address
mongoose.connect('mongodb://localhost:27017/Final_Project', { useNewUrlParser: true })
  .then(() => console.log('Connected successfully'))
  .catch(err => console.error('Connection failed:', err))
