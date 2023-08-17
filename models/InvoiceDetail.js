const mongoose = require('mongoose')


const InvoiceDetailSchema = new mongoose.Schema({
 
   data:{
      type:Object,
      required:true
  },
  date:{
    type:String,
    required:true
  },id:{
    type:String,
    required:true
  }
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("InvoiceDetail",InvoiceDetailSchema)