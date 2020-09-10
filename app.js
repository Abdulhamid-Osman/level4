const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const ejs = require("ejs");
const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
//Connect to mongo DB
mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology:true, useNewUrlParser:true});
//USER SCHEMA
const userSchema = {
    email: String,
    password: String
};
//Creating user model
const User = mongoose.model("User", userSchema);


//Get/rendering Home page to the screen
app.get("/",(req,res)=>{
    res.render("home")
});
//Get/rendering Login page to the screen
app.get("/login",(req,res)=>{
    res.render("login")
});
//Get/rendering Register page to the screen
app.get("/register",(req,res)=>{
    res.render("register")
});
//Get secret page
app.get("/secrets",(req,res)=>{
    res.render("secrets");
});
//Registering user to the DB
app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email:req.body.username,
            password:hash
        });
        newUser.save((err)=>{
            if(err){
                console.log(err)
            }else{
                res.render("secrets")
            }
        });
    });
    
});
//user login
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},(err, foundUser)=>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result === true){
                        res.render("secrets");
                    }
                });
                    
               
            }
        }
    });
});




app.listen(3000,()=>{
    console.log("Now you can start working in peace not pieces!!!");
});

