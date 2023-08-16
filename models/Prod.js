const mongoose = require('mongoose')


const ProdSchema = new mongoose.Schema({
   data:[
    { type:Object,
        required:true}

   ],
   slug:{
      type:String,
      required:true
  },
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("Prod",ProdSchema)