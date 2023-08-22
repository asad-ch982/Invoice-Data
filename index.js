const express = require("express");
const app = express();
const port = 5000;
const connecttomongo = require("./db");
require('dotenv').config();
connecttomongo();
const User = require("./models/User");
const Invoices = require("./models/Invoices")
const Prod = require("./models/Prod")
const Company =require("./models/Company")
const Clients =require("./models/Clients")
const cors = require('cors');
var bodyParser = require('body-parser')
const mongoose = require("mongoose");
const InvoiceDetail = require("./models/InvoiceDetail");
const JSONStream = require('JSONStream');
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
var jsonParser = bodyParser.json()
app.post("/",jsonParser, async (req, res) => {
 

});

// UPDATING CLIENT API
app.post("/updateclient",jsonParser, async (req, res) => {
  const {billingAddress,email,mobileNo,name,id,image,_id}=req.body.client
    const client = await Clients.findOneAndUpdate({_id:_id},{
      billingAddress:billingAddress,
      email:email,
      mobileNo:mobileNo,
      name:name,
      id:id,
      image:image
    })
    if (client) {
      res.status(200).json({success:true})
    } else{
      res.status(400)
    }
});

// DELETING CLIENT API
app.post("/delclient",jsonParser, async (req, res) => {
  
  const existingClient = await Clients.findOne({id:req.body.id})
    const del = await Clients.findByIdAndRemove(existingClient._id)
    if (del) {
      res.status(200).json({success:true})
    } else{
      res.status(400)
    }
});

// GETTING CLIENTS API ALL
app.post("/getclients", async (req, res) => {
  let clients  = await Clients.find()
  res.status(200).json({clients})

});


// ADDING CLIENT API
app.post("/addclient",jsonParser, async (req, res) => {
  const {billingAddress,email,mobileNo,name,id,image}=req.body.client
  const u = await Clients({
    billingAddress:billingAddress,
    email:email,
    mobileNo:mobileNo,
    name:name,
    id:id,
    image:image
  })
  await u.save()
  res.status(200).json({success:true})
});


// ADDING COMPANY DATA API
app.post("/addcompany",jsonParser, async (req, res) => {
  
    const {billingAddress,companyEmail,companyMobile,companyName,id,image}=req.body.company
    const existingCompany = await Company.findOne({companyEmail:companyEmail})
    if (existingCompany) {
    // const del = await Company.findByIdAndRemove(existingCompany._id)
    res.status(200).json({success:true})
    return
    }else {
    const u = await Company({
      billingAddress:billingAddress,
      companyEmail:companyEmail,
      companyMobile:companyMobile,
      companyName:companyName,
      id:id,
      image:image
    })
    await u.save()
  }
  res.status(200).json({success:true})
    // }
  // res.status(200).json({data:"ok"})
});

// GETTING COMPANY DATA API
app.post("/getcompany", async (req, res) => {
 
  let company  = await Company.findOne()
  res.status(200).json({company})
  // res.status(200).json({data:"ok"})
});
// GETTING INVOICES API ALL
app.post("/getinvoices", async (req, res) => {
  // const {datas} = req.body
  try {
    
 
  let InvoiceData =[]
  // var d = new Date(Date.now());
  // const date= d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  let data  = await Invoices.find({date:req.body.date})
  if (data!==[]) {
  
  for (const key in data) {
      if (data.hasOwnProperty(key) && data[key].data) {
          InvoiceData.push(...data[key].data); 
      } 
  }
  res.status(200).json({data:InvoiceData})
  // res.status(200).json({data:"ok"})
  }else if (data===[]) {
    res.status(400)
    return
  }
} catch (error) {
  console.log(error)
}
});

// ADDING INVOICE API NEW INVOICE
app.post("/invoice",jsonParser, async (req, res) => {
  const {invoice,invoicedetail,date} = req.body
       const code = Date.now()
      //  let products = invoicedetail.products
      //  console.log(products)
      //  for (let id in products) {
      //   console.log(products[id].quantity)
      //  }
        // dd/mm/yyyy
        let u =  Invoices({data:invoice,date:date,InvoiceId:code,id:invoice.id});
        await u.save();
        let p = await InvoiceDetail({data:invoicedetail,date:date,id:invoice.id})
        await p.save()
        let products = invoicedetail.products
       
        for (let slug in products) {
         const prods = await Prod.findOne({slug:products[slug].slug})
         if (prods) {
           let availableQty = prods.data[0].availableQty - products[slug].quantity
         let newdata = {...prods.data[0],availableQty} 
             const change = await Prod.findOneAndUpdate({slug:products[slug].slug},{
               data:newdata
             })
         }
         
        }
        res.status(205).json({success:true})
});
// CUSTOMIZE DATE FETCHING 
app.post("/cusinvoice",jsonParser, async (req, res) => {
  try {
    
  
  const {start,end}= req.body
  console.log(start,end)
        const invoices = await Invoices.find({createdAt:{"$gt" : start+"T00:00:00.000Z","$lt" : end+"T23:59:59.000Z"}})
        // const invoiceDetailList = await InvoiceDetail.find({createdAt:{"$gt" : start+"T00:00:00.000Z","$lt" : end+"T23:59:59.000Z"}})
        // console.log(invoices,invoiceDetailList)
        if (invoices) {
         
          let invoiceData = []
        //   let invoiceDetailData = []
        //    for (const key in invoiceDetailList) {
        //      if (invoiceDetailList.hasOwnProperty(key) && invoiceDetailList[key].data) {
        //        invoiceDetailData.push(invoiceDetailList[key].data); 
        //      } 
        //  }
         for (const key in invoices) {
           if (invoices.hasOwnProperty(key) && invoices[key].data) {
               invoiceData.push(...invoices[key].data); 
           } 
       }
       const data = [invoiceData]
          res.setHeader('Content-Type', 'application/json');
  
          data.forEach((item) => {
            res.write(JSON.stringify(item) + '\n');
          });
          
          res.end();
        }
        
       
      } catch (error) {
          console.log(error)
          res.status(400)
      }
});
// MINUS PRODUCTS AFTER INVOICE
app.post("/minusprod",jsonParser, async (req, res) => {
  const {invoicedetail} = req.body
 
       let products = invoicedetail.products
       
       for (let slug in products) {
        const prods = await Prod.findOne({slug:products[slug].slug})
        if (prods) {
          let availableQty = prods.data[0].availableQty - products[slug].quantity
        let newdata = {...prods.data[0],availableQty} 
            const change = await Prod.findOneAndUpdate({slug:products[slug].slug},{
              data:newdata
            })
        }
        
       }
        // dd/mm/yyyy
    
        res.status(205).json({success:true})
});
// GETTING INVOICE DETAIL
app.post("/getinvoicedetail",jsonParser, async (req, res) => {
  // const {id}=req.body
  // const invoice = await Invoices.findOne({id:id})
  try {
  const invoiceDetail = await InvoiceDetail.find({date:req.body.date})
  let data=[]
  if ( invoiceDetail) {
    for (const key in invoiceDetail) {
      if (invoiceDetail.hasOwnProperty(key) && invoiceDetail[key].data) {
          data.push(invoiceDetail[key].data); 
      } 
  }
     res.status(200).json({data:data})
  }else if(!invoiceDetail){
    res.status(200)
    return
  }
} catch (error) {
    console.log(error)
}
// res.status(200).send({success:true})
});
// UPDATING INVOICE STATUS PAID UNPAID DRAFT
app.post("/updateStatus",jsonParser, async (req, res) => {
 const {data} = req.body
  const {statusName,statusIndex} = data
  try {
    
 
 const invoiceDetail = await InvoiceDetail.findOne({id:data.id})
 const delta = invoiceDetail.data 
 const dalta = {...delta,statusIndex,statusName}
 const invoiceDetailUp = await InvoiceDetail.findOneAndUpdate({id:data.id},{
  data:dalta
 })
 const datai =[
  {
    id:data.id,
    invoiceNo:data.invoiceNo,
    statusName:data.statusName,
    statusIndex:data.statusIndex,
    totalAmount:data.totalAmount,
    dueDate:data.dueDate,
    createdDate:data.createdDate,
    clientName:data.clientDetail.name


  }
 ]

 const invoice = await Invoices.findOneAndUpdate({id:data.id},{
  data:datai
 })
 res.status(200).send({suceess:true})
} catch (error) {
    console.log(error)
}
  
});

// DELETING INVOICE API 
app.post("/delinvoice",jsonParser, async (req, res) => {
  const {id} = req.body
  const invoice = await Invoices.findOne({id:id})
  const invoiceDetail = await InvoiceDetail.findOne({id:invoice.id})
  if (invoice && invoiceDetail) {
    const del = await Invoices.findByIdAndRemove(invoice._id)
    const deli = await InvoiceDetail.findByIdAndRemove(invoiceDetail._id)
      if (del && deli) {
        res.status(200).json({success:true})
      } else{
        res.status(400)
      }
  }else{
    res.status(400)
  }
      
});
// GETTING PRODUCTS API ALL
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
// DELETING PRODUCTS API
app.post("/delprod",jsonParser, async (req, res) => {
  const existingProd = await Prod.findOne({slug:req.body.slug})
  const del = await Prod.findByIdAndRemove(existingProd._id)
  if (del) {
    res.status(200).json({success:true})
  } else{
    res.status(400)
  }

});
// UPDATING PRODUCTS API
app.post("/updateprod",jsonParser, async (req, res) => {
  const {name,slug,image,productID,amount,availableQty}= req.body.prod
  const existingProd = await Prod.findOne({slug:slug})

  let newprod = []
  newprod.push(req.body.prod)
 
  const prod = await Prod.findOneAndUpdate({slug:slug},{
    data:newprod
  })
  if (prod) {
    res.status(200).json({success:true})
  } else{
    res.status(400)
  }

});


// ADDING PRODUCTS API
app.post("/addprod",jsonParser, async (req, res) => {
  const {name,slug,image,productID,amount,availableQty}= req.body.data
  let p = new Prod({
     data:req.body.data,slug:slug
  })
  await p.save();

  res.status(200).json({success:true})
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
