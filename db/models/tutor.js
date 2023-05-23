const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    username: {
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
    password: {
        required: true,
        type: String,
        default : '12345',
    },    
    address: {
        type: String,
        default : '',
    },
    status : {
        type: String,
        default : 'active',
    }
})
const Tutor =  mongoose.model('tutors', dataSchema);
module.exports = Tutor;