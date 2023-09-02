const mongoose = require('mongoose')


const AuthSchema = new mongoose.Schema({
 
    ID:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    type:{
        type:String,
        required:true

    }
    
},{timestamps:true}); 
// mongoose.models = {}
// export default mongoose.model("Prod",ProdSchema)
module.exports = mongoose.model("Auth",AuthSchema)