//Test model
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: false,
        type: String,
        defaul: 'noname',
    },
    email: {
        required: false,
        type: String,
        default : 'email',
    }
})

module.exports = mongoose.model('Data', dataSchema)