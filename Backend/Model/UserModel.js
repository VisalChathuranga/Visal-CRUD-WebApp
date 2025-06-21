const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,//data type
        required: true// validate
    },
    email: {
        type: String,//data type
        required: true,// validate
        unique: true
    },
    age: {
        type: Number,//data type
        required: true// validate
    },
    address: {
        type: String,//data type
        required: true// validate
    },
    password: {
        type: String,//data type
        required: true// validate
    }
});

module.exports = mongoose.model(
    "UserModel",//file name
    userSchema//function name
) 