const Auth = require("../models/Auth");

const salesauth = async (req, res, next) => {
    const { authno } = req.body;
  const user = await Auth.findOne()
  if (authno ===user.owner || authno ===user.salesman) {
    next()
  }else{
    res.status(400).json({success:false})
    return
  }
 
};

module.exports = salesauth;