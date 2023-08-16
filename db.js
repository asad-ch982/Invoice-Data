const mongoose = require('mongoose')
require('dotenv').config();
mongoose.set('strictQuery',false);
const conectToMongo = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    console.log('Connected')
}
module.exports = conectToMongo;