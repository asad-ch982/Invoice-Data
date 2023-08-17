const mongoose = require('mongoose')


const CLientsSchema = new mongoose.Schema({
 
   billingAddress:{
      type:String,
      required:true
   },id:{
    type:String,
    required:true
},
image:{
    type:String,
    required:true
},
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
mobileNo:{
    type:String,
    required:true
}
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("Clients",CLientsSchema)