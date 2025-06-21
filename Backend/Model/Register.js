const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const regiSchema = new Schema({
    name: {
        type: String,//data type
        required: true// validate
    },
    email: {
        type: String,//data type
        required: true,// validate
        unique: true
    },
    password: {
        type: String,//data type
        required: true// validate
    }
});

module.exports = mongoose.model(
    "Register",//file name
    regiSchema//function name
) 