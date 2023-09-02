const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken")
const auth = async (req, res, next) => {
    const { token } = req.body;
    console.log(token)
    try {

  const user =  jwt.verify(token,process.env.JWT_SECRET)
    if(user){
        if(user.type==="ADMIN"){
            next()
        }else if(user.type!=='ADMIN'){
            res.status(404).json({success:false})
            return
        }
    }
        
} catch (error) {
    console.log(error)
    res.status(404).json({success:false})
    return
}
 
};

module.exports = auth;
