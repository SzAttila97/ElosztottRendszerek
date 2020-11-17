const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const user = require("./users");
const cors = require('cors');
const iphone = require('./api/iphone');
const port = process.env.PORT || 8080;
const passport = require('passport');
const { connect } = require("mongodb");

const Stragety = require('passport-facebook').Strategy;


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

const session = require("express-session")

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))


passport.serializeUser(function (user, next){
    next(null, user);
});
passport.deserializeUser(function(obj, next){
    next(null, obj);
});


passport.use(new Stragety({
    clientID:"1073895849730583",
    clientSecret:"7010e375fe43d88512b9f946a059ad77",
    callbackURL:"/user/login/facebook/callback"
},
function (accesToken, refresToken, profile, next){
    /*var user = {
        "name": profile.name.familyName + " " + profile.name.givenName,
        "id": profile.id,
        "token": accesToken
    }*/
    console.log(profile)
    return next(null, profile);
}
));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use("/user", user);
app.use(cors());
app.use('api/iphone', iphone);


app.listen(port, () => {
    console.log("Server is running on " + port)
});
//});

app.get("/helloworld", (req, res) => {
    res.send("Hello World");
});

app.get("/", (req, res) => {
    console.log(req.user)
    res.send("Hello " + req.user.displayName);
});
