const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: false,
        type: String,
        defaul: 'Name'
    },
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
    },
    wallet : {
        type: Number,
        default :0 
    }
})
const Tutor =  mongoose.model('tutors', dataSchema);
module.exports = Tutor;