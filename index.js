const express = require('express')
const { MongoClient } = require('mongodb');

const ObjectId=require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = 5000

//Midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edakp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try {
        await client.connect();
        const database = client.db("carMechanique");
        const servicesCollection = database.collection("services");

        //Get All data
        app.get('/services', async(req,res)=>{
          const cursor = servicesCollection.find({});
          const services=await cursor.toArray();
          res.send(services);  

        });

        //Get Signle Service
        app.get('/services/:id', async(req,res)=>{
         const id=req.params.id;
         console.log('getting service by ',id);
         const query={_id:ObjectId(id)};
         const service=await servicesCollection.findOne(query);
         res.json(service);


        // POST API 

        app.post('/services', async(req,res)=>{
          
          const service=req.body;
          console.log('hit the post api',service);
          const result = await servicesCollection.insertOne(service);
          console.log(result);
          res.json(result)
        });
      } 
      finally {
        // await client.close();
      }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Genious Macheniques!')
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})