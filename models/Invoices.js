const mongoose = require('mongoose')


const InvoicesSchema = new mongoose.Schema({
    data:[
        { type:Object,
        required:true}
       
        ],
        date:{
            type:String,
            required:true
        },
        InvoiceId:{
            type:String,
            required:true
        },id:{
            type:String,
            required:true
        }
},{timestamps:true,
});

// mongoose.models = {}
// export default mongoose.model("Invoices",InvoicesSchema)
module.exports = mongoose.model("Invoices",InvoicesSchema)