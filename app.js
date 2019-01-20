const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolist", {useNewUrlParser: true});

var itemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema);

// var workItemSchema = mongoose.Schema({
//     item: {
//         type: String,
//         required: true
//     }
// })

const Workitem = mongoose.model('Workitem', itemSchema);

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
}

const List = mongoose.model('List', listSchema);

const item1 = new Item({
    item: "Add your own items"
})

const item2 = new Item({
    item: "Delete by checking the checkbox"
})

const customItems = [item1, item2];


app.get("/", function(req, res){

    let route = "/work";

    let day = date.getDate()
    
    let dailyItems = [];

    Item.find({}, function(err, items){
        if (err) { throw err} else {
            items.forEach(function(item){
                dailyItems.push(item);
            })
        };
        
        res.render("list", {listTitle: day, items: dailyItems, route: route});
    })  
})

app.get("/work", function(req, res){

    let route = "/";

    let workItems = [];

    Workitem.find({}, function(err, workitems){
        if (err) throw err;
        workitems.forEach(function(workitem){
            workItems.push(workitem);
        });
    
        res.render("list", {listTitle: "Work List", items: workItems, route: route});
    })
})

app.get("/:customListName", function(req, res){

    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if (err){ throw err} else {
           
            if (foundList === null){
                const list = new List({
                    name: customListName,
                    items: customItems
                })
            
                list.save();
                res.redirect("/" + customListName);
            } else {
              
                res.render("list", {listTitle: foundList.name, items: foundList.items, route: "/"});
            }
        }
    })
})

app.post("/", function(req, res){
    let list = req.body.list;

    if (list === "Work"){

        const workitem = new Workitem({item: req.body.newItem});
        
        workitem.save();

        res.redirect("/work");
    } else {

    const item = new Item({item: req.body.newItem});
    
    item.save();

    res.redirect("/");
    }
})

app.post("/delete/", function(req, res){
   
    let deleteItem = req.body.checkbox;
    
    Workitem.deleteOne({item: deleteItem}, function(err){
        if (err) { throw err} else {
            console.log("Workitem was deleted");
        }
        res.redirect("/work");
    })   
})

app.post("/delete/work", function(req, res){

    let deleteItem = req.body.checkbox;

    Item.deleteOne({item: deleteItem}, function(err){
        if (err) { throw err} else {
            console.log("Item was deleted");
        }
        res.redirect("/");
    }) 
})

app.listen(3000, function(){
    console.log("The server is running on port 3000");
})