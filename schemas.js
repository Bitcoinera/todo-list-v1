const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-ana:<PASSWORD>@cluster0-hbymp.mongodb.net/todolistDB", {useNewUrlParser: true});

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

exports.Item = Item;
exports.List = List;
