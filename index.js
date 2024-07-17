const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride  = require("method-override");
const ExpressError = require("./ExpressError");



app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

main()
.then((res) => { console.log("Connection Successful")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// let chat1 = new Chat({ 
//     from: " ritesh ",
//     to: "dikkar",
//     msg: " ye Vedya aahe ka",
//     created_at: new Date()
// });

// chat1.save().then((res) => { console.log(res) } ).catch((err) => { console.log(err) } );

app.listen(8080, () => {
    console.log("Server is working on port no.. 8080");
});


app.get("/", (req,res) => {
    res.send("Root server is working ! ");
});

// Index Route
app.get("/chats", async (req,res) => {
    try{
        let chats = await Chat.find(); // .find() is an asynchronous function which returns a promise which uses await keyword 
    //console.log(chats);
    res.render("index.ejs",{ chats });
    }catch(err){
        next(err);
    }

})

//New Route
app.get("/chats/new", async (req,res) => {
    // throw new ExpressError(404, "Page Disconnected !");
    res.render("new.ejs")

})

//Create Route
app.post("/chats", async (req,res) => {
    try{
        let {from,to,msg} = req.body;;
    let newChat = new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at: new Date()
    });
    await newChat.save().then((res) => { console.log("Chat was saved") } )
    .catch((err) => { console.log(err) });
    res.redirect("/chats")
    }catch(err){
        next(err);
    }
});

function asyncwrap(fn) {
    return function (req,res,next) {
        fn(req, res, next).catch((err) => next(err));
    };
};

//New - Edit Route
app.get("/chats/:id", asyncwrap( async (req,res, next) => {
        let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        next(new ExpressError(404, "Your Chat not found "));
    }
    res.render("edit.ejs", { chat });

}));


//Edit Route
app.get("/chats/:id/edit", async (req,res) => {
    try{
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    }catch(err){
        next(err);
    }

})

//Update Route
app.put("/chats/:id", async (req,res) => {
    try{
        let { id } = req.params;
        let { msg : newMsg } =req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg : newMsg},{runValidators:true, new:true });
    
        console.log(updatedChat);
        res.redirect("/chats");
    }catch(err){
        next();
    }

})

//Destroy Route
app.delete("/chats/:id", async (req,res) => {
    try{
        let { id } = req.params;
        let deleteChat = await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
})

app.use((err, req, res, next) => {
    console.log(err.name);
    next(err);
});

// Error handling middleware 
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Random Error "} = err;
    res.status(status).send(message);
})