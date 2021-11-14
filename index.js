const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnw2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const vacationPackageCollection = database.collection('vacationPackages');
        const contactDetailsCollection = database.collection('contactUs');
        const orderDetailsCollection = database.collection('placeOrder');

        // GET/FIND API or GET Products API
        app.get('/vacationPackages', async (req, res) => {
            const cursor = vacationPackageCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // POST Contact Us
        app.post('/contactUs', async (req, res) => {
            const contactDetails = req.body;
            console.log('hit the post api', contactDetails)
            const result = await contactDetailsCollection.insertOne(contactDetails);
            console.log(result)
            res.json(result)
        })

        // POST Order (Place an order)
        app.post('/placeOrder', async (req, res) => {
            const orderDetails = req.body;
            console.log('hit the post api', orderDetails)
            const result = await orderDetailsCollection.insertOne(orderDetails);
            console.log(result)
            res.json(result)
        })

        // GET Single Item
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const package = await vacationPackageCollection.findOne(query);
            res.json(package);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my Tourism Server')
})

app.listen(port, ()=>{
    console.log('Running server on port', port)
})