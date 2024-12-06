const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();

const port = process.env.PORT || 8080;
// middleware 
app.use(express.json());
app.use(cors());

// DB_User="admin"
// DB_Pass="qqHbw9WRD3PbQEw2"
// const uri = "mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.f0l8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb+srv://admin:qqHbw9WRD3PbQEw2@cluster0.f0l8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run(){
    try {

        // await client.connect();
        // await client.db("admin").command({ ping: 1 });

        const sportEquipments= client.db('sportsEquipmentDB').collection('equipments')

        app.post('/equipments', async (req, res)=>{
            const data= req.body; // frontend er body theke data ashbe
            console.log(data)

            const result = await sportEquipments.insertOne(data)
            res.send(result)
        })

        app.get('/equipments', async(req, res)=>{
            const result= await sportEquipments.find().toArray();
            res.send(result)
        })


        // Delete method
        app.delete('/equipments/:objId', async (req, res)=>{
            const id= req.params.objId;
            const query= {_id: new ObjectId(id)};
            const result = await sportEquipments.deleteOne(query);
            res.send(result)
            console.log(id);
        })

        // update api
        app.get('/equipments/:objId', async (req, res)=>{
            const id= req.params.objId;
            const query= {_id: new ObjectId(id)};
            const result = await sportEquipments.findOne(query);
            res.send(result)
            console.log(id);
        })


        app.patch('/equipments/:objId',  async (req, res)=>{
            const id= req.params.objId;
            const data = req.body;
            const query= {_id: new ObjectId(id)};
            const update= {
                $set:{
                    name:data?.name,
                    category:data?.category,
                    price:data?.price,
                    rating:data?.rating,
                    stock:data?.stock,
                    pTime:data?.pTime,
                    imgurl:data?.imgurl,
                    description:data?.description,
                },
            };

            const result = await sportEquipments.updateOne(query, update);
            res.send(result)
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
    } catch (error) {
        console.log(error)
    }
}

run();



app.get('/', (req, res)=>{
    res.send("Server is running from port 8080")
})
app.listen(port, ()=>{
    console.log("Server is running")
})

