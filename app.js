const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

let newItems= []; //stores the client's todo-list tasks
let newWorkItems = [];

app.get("/", function(req, res){
    let route = "/work";

    let today = new Date();
    let options = { weekday: "long", day: "numeric", month: "long"};

    let currentDay = today.toLocaleDateString("en-US", options);

    res.render("list", {listTitle: currentDay, items: newItems, route: route});
})

app.post("/", function(req, res){
    let list = req.body.list;

    if (list === "Work"){

        newWorkItems.push(req.body.newItem);
        
        res.redirect("/work");
    } else {

    newItems.push(req.body.newItem);
        
    res.redirect("/");
    }
})

app.get("/work", function(req, res){

    let route = "/";
   
    res.render("list", {listTitle: "Work List", items: newWorkItems, route: route});
})

app.listen(3000, function(){
    console.log("The server is running on port 3000");
})