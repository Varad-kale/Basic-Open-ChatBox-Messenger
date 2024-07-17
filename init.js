const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
.then((res) => { console.log("Connection Successful")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allChats = [
    {
        from: " Smit ",
        to: "Ojas",
        msg: " Notes de re ",
        created_at: new Date()
    },
    {
        from: "Oden",
        to: "Thor",
        msg: "your are my true wealth:",
        created_at: new Date()
    },
    {
        from: " Dhyanesh ",
        to: "varad",
        msg: "Aloo parathe ",
        created_at: new Date()
    },
    {
        from: " Varad ",
        to: "Ritesh_Dada",
        msg: "Are te , Are Yedya aahe ",
        created_at: new Date()
    },
]



Chat.insertMany(allChats);

