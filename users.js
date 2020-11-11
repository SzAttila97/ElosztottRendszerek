const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userMiddleWae = require("./validation")


router.get("/", async (req, res) => {
    const users = await loadUserCollection();
    res.send(await users.find().toArray());
});

router.post("/register", async (req, res) => {
    let email = req.body.email
    let name = req.body.name;
    let password = req.body.password;
    if(name==null || password==null || email == null){
        res.status(400).send("cannot be empty")
    }
    const users = await loadUserCollection();
    
    let exists = await users.find({email:email}).toArray();
    if(exists.length > 1){
        res.status(400).send("user exist");
        return;
    }
    bcrypt.hash(password, 10, (err, hash)=>{
        if(err){
            return res.status(500).send("Sózás elbaszva");
        }
        users.insertOne({
            email: email,
            name: name,
            password: hash
        });
    });
    res.send("inserted");
});

router.post("/login", async(req, res)=>{
    let email = req.body.email
    let password = req.body.password;

    if(email == null || password == null){
        res.status(400).send("cannont be empty")
    }
    const users = await loadUserCollection();
    let user = await users.find({email: email}).toArray();
    console.log(user[0]);
    bcrypt.compare(password, user[0].password, (err, result)=>{
        if(err){
            res.status(400).send("Wrong PW!")
        }
        if(result){
            const token = jwt.sign({
                email:user[0].email,
                userId:user[0]._id
            },
                'SECRETKEY', {
                    expiresIn:'7d'
                }
            );
            return res.status(200).send({
                msg:'Belépve',
                token,
                user:result[0]
            })
            console.log(result);
        }
    });
   // res.send("belépve");
})

router.get('/profile', userMiddleWae.isLoggedIn, async(req, res) =>{
    const users = await loadUserCollection();
    let user = await users.find({email: req.userData.email}).toArray();
    res.send(user[0].name);
    
})

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://user3:user3@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("users");
}

module.exports = router;