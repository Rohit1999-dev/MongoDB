const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Details = new Schema({
    Player_name: {
        type: String
    },
    Country: {
        type: String
    },
    Description: {
        type: String
    }
});

module.exports = mongoose.model('Details', Details);