const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/myproject', {useNewUrlParser: true});

const db = mongoose.connection;

const itemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const Item = db.model('Item', itemSchema);

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: {
    type: [itemSchema],
    default: []
    }
}

const List = db.model('List', listSchema);

module.exports = {
    Item,
    List
};

