const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const user = require("./users");
const cors = require('cors');
const iphone = require('./api/iphone');
const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/user", user);
app.use(cors());
app.use('/api/iphone', iphone);


app.listen(port, () => {
    console.log("Server is running on " + port)
});
//});

app.get("/helloworld", (req, res) => {
    res.send("Hello World");
});
