const Auth = require("../models/Auth");

const auth = async (req, res, next) => {
    const { authno } = req.body;
  const user = await Auth.findOne()
  if (authno ===user.owner) {
    next()
  }else{
    res.status(400).json({success:false})
    return
  }
 
};

module.exports = auth;
