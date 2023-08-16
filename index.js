const express = require("express");
const app = express();
const port = 5000;
const connecttomongo = require("./db");
require('dotenv').config();
const mongodb = require("mongodb");
connecttomongo();
const MongoClient = require("mongodb").MongoClient;
const User = require("./models/User");
const Invoices = require("./models/Invoices")
const Prod = require("./models/Prod")
const cors = require('cors');
var bodyParser = require('body-parser')
const mongo = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});
app.use(cors());
var jsonParser = bodyParser.json()

app.get("/mongo-video3", async (req, res) => {
  try {
    const id = req.query.id;
    let user = await User.findById(id);
    if (user.plan === true) {
      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires Range header");
      }
      const db = mongo.db("videos2");
      filename = "bigbuck2";
      // GridFS Collection
      const video = await db
        .collection("fs.files")
        .findOne({ filename: filename });
      if (!video) {
        res.status(404).send("No video uploaded!");
        return;
      }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = await bucket.openDownloadStreamByName(filename, {
        start,
        end,
      });

      // Finally pipe video to response
      downloadStream.pipe(res);
    } else {
      res.status(400).send({ user });
    }
  } catch (error) {
    console.error(error.message);
  }
});
app.post("/getinvoices", async (req, res) => {
  // const {datas} = req.body
  let InvoiceData =[]
  // var d = new Date(Date.now());
  // const date= d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  let data  = await Invoices.find()
  for (const key in data) {
      if (data.hasOwnProperty(key) && data[key].data) {
          InvoiceData.push(...data[key].data); 
      } 
  }
  res.status(200).json({data:InvoiceData})
  // res.status(200).json({data:"ok"})
});
app.post("/invoice",jsonParser, async (req, res) => {
  const {data} = req.body
        console.log(data)
        var d = new Date(Date.now());
       const date= d.toLocaleDateString('en-GB');
        // dd/mm/yyyy

        let u =  Invoices({data:data,date:date,InvoiceId:data.id});
        await u.save();
        res.status(205).json({success:true})
});
app.post("/getprod",jsonParser, async (req, res) => {
  let products=[]
  let data = await Prod.find()
  for (const key in data ) {
      if (data.hasOwnProperty(key) && data[key].data) {
          products.push(...data[key].data); 
      } 
  }
  res.status(200).json(products)
});
app.post("/addprod",jsonParser, async (req, res) => {
  console.log(req.body)
  const {name,slug,image,productID,amount,availableQty}= req.body.data
  console.log(req.body.data)
  let p = new Prod({
     data:req.body.data,slug:slug
  })
  await p.save();

  res.status(200).json({success:true})
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
