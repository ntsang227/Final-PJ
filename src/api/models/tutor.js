const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: false,
        type: String,
        defaul: 'No Name',
    },
    birthday: {
        type: Date,
        defaul: '1/1/1960',
    },
    email: {
        required: true,
        type: String,
        default : '',
    },
    username: {
        required: true,
        type: String,
        default : 'tutor',
    },
    password: {
        required: true,
        type: String,
        default : '12345',
    },    
    address: {
        type: String,
        default : '',
    },
    job : { 
        type : String,
        default : '',
    }
})
module.exports = mongoose.model('tutors', dataSchema)