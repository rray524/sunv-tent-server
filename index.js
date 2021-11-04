const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// dotenv
require('dotenv').config();

const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4jhnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("CampTent");
        const serviceCollection = database.collection("services");
        const cartCollection = database.collection("cart");


        // GET API FROM SERVICES (HOME PAGE)
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //POST API FOR SERVICES ( HOME PAGE)
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })
        // GET API FOR INDIVIDUAL SERVICE (CART)
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        // POST API ORDER 
        app.post('/cart', async (req, res) => {
            const order = req.body;
            const result = await cartCollection.insertOne(order);
            res.json(result)
        })
        // GET API FROM ORDERs
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find({ email: req.query.email });
            const orders = await cursor.toArray();
            res.send(orders)
        })
        // DELETE SINGLE ORDER FROM API
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running port');
});

app.listen(port, () => {
    console.log('Running server on port', port);
})