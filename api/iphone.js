const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const userMiddleware = require('../validation');

router.get("/", async (req, res)=>{
    const iphones = await loadIphoneCollection();
    res.send(await iphones.find().toArray());
})

router.post("/upload", userMiddleware.isLoggedIn, async (req, res)=>{
    let iphone = {
     uploader : req.userData.email,
     model : req.body.model,
     price : req.body.price,
     color : req.body.color
    }
   
    if(iphone.model && iphone.price && iphone.color){
        const iphones = await loadIphoneCollection();
        let response = await iphones.insertOne(iphone);
        if(response.insertedId){
            res.status(201).send({msg: "Hozzáadva az új tius! Id-ja: " + response.insertedId});
        }
    }
    res.send(400).send({msg: "Nem sikerült, hiányzó adat"});
})

router.delete("/:id", userMiddleware.isLoggedIn, async (req, res)=>{
    let user = req.userData.email;
    let id = req.params.id;
    let now = new Date().getTime();
    const logger = await loadLogCollection();
    if(id && user){
        const iphones = await loadIphoneCollection();
        logger.insertOne({
            user:user,
            information:"atempted deleting iphone with id of " + id,
            date: now
        });
        let succes = iphones.deleteOne({_id: new mongodb.ObjectID(id)})
        if(succes){
            logger.insertOne({
                user:user,
                information:"iphone with the id of " + id + " has ben deleted!",
                date: now
            })
            res.status(202).send({msg:"deleted"});
        }
        return;
    }else{
        logger.insertOne({
            user:user,
            information:"attemted to delete iphone with the id of " + id + " but failed",
            date: now
        })
    }
})

async function loadIphoneCollection(){
    const client = await mongodb.MongoClient.connect('mongodb+srv://user3:user3@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("iphone");
}
async function loadLogCollection(){
    const client = await mongodb.MongoClient.connect('mongodb+srv://user3:user3@cluster0.bzsge.mongodb.net/AppleStore?retryWrites=true&w=majority', {useNewUrlParser: true});
    return client.db("AppleStore").collection("log");
}

module.exports=router;