
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//đường dẫn mongoDb
const mongoString = 'mongodb://localhost:27017/';

mongoose.connect(mongoString, { useNewUrlParser: true, dbName: 'Final_Project' });

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log(`Database Connected ${new Date().toLocaleTimeString()}`);
})
const app = express();
app.use(express.json());
