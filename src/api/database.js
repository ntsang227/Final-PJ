
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//đường dẫn mongoDb
const mongoString = 'mongodb://localhost:27017/Final_Project';

console.log(mongoString);
mongoose.connect(mongoString, { useNewUrlParser: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log(`Database Connected ${new Date().toLocaleTimeString()}`);
})
const app = express();
app.use(express.json());

const routes = require('./routes/routes');
const admins = require('./routes/admins');

app.use('/api', routes);
app.use('/api', admins);

app.listen(3000, () => {
    console.log(`Database server started at ${3000}`)
})