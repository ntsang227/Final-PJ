const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        required: false,
        type: String,
        defaul: 'Admin',
    },
    email: {
        required: false,
        type: String,
        default : 'noemail',
    },
    username: {
        type: String,
        default : 'admin',
    },
    password: {
        type: String,
        default : '12345',
    }


})

module.exports = mongoose.model('admins', adminSchema)