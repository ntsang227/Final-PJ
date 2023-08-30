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
    },
    status: {
        type: String,
        default : 'active',
    },
    authority: {
        type: Number,
        default : '1',
    }
})
const Admin = mongoose.model('admins', adminSchema)
module.exports = Admin