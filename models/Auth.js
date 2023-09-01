const mongoose = require('mongoose')


const AuthSchema = new mongoose.Schema({
 
    owner:{
        type:String,
        required:true

    },
    salesman:{
        type:String,
        required:true

    }
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("Auth",AuthSchema)