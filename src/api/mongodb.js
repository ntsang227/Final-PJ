const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost/Final_Project', { useNewUrlParser: true, useUnifiedTopology: true });

// Định nghĩa schema và model

const userSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'No Name'
    },
    email: {
        type: String,
        default: 'No Type'
    }
});


const User = mongoose.model('User', userSchema);

// API endpoint
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/users', async (req, res) => {
    if (!req.body || !req.body.name || !req.body.email) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    });
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`MongoDB api server is running at port ${port}`);
});
