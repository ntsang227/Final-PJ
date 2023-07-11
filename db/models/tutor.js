const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    username: {
        required: false,
        type: String,
        default: 'No Name',
    },
    avt: {
        type: String,
        default: ''
    },
    birthday: {
        type: Date,
        default: '',
    },
    email: {
        required: true,
        type: String,
        default : '',
    },
    phonenumber: {
        type: String,
        default : '',
    },
    password: {
        required: true,
        type: String,
        default : '',
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