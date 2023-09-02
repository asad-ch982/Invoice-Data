const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken")
const salesauth = async (req, res, next) => {
    const { token } = req.body;
    try {

        const user =  jwt.verify(token,process.env.JWT_SECRET)
          if(user){
              if(user.type==="ADMIN" || user.type==="SALESMAN"){
                  next()
              }
          }
              
      } catch (error) {
          console.log(error)
          res.status(404).json({success:false})
          return
      }
 
};

module.exports = salesauth;