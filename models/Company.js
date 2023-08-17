const mongoose = require('mongoose')


const CompanySchema = new mongoose.Schema({
 
   billingAddress:{
      type:String,
      required:true
  },
  companyEmail:{
      type:String,
      required:true,
      unique:true
  },
  companyMobile:{
      type:String,
      required:true
  },
  companyName:{
      type:String,
      required:true
  },
  id:{
      type:String,
      required:true
  },
  image:{
      type:String,
      required:true
  },
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("Company",CompanySchema)