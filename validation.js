const jwt = require('jsonwebtoken');

module.exports={
    isLoggedIn : (req, res, next)=>{
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
                token,
                'SECRETKEY'
            );
            req.userData=decoded;
            next();
        }catch(err){
            console.log(err)
            return res.status(400).send({
                msg:"Nem vagy belépve"
            });
        }
}
    
}