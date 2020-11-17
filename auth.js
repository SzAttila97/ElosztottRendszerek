const passport = require('passport');
const Stragety = require('passport-facebook').Strategy;



exports.ensureAuthenticated = function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated())
    return next();
    res.status(400).send({msg:"Not logged in!"})
}