const express = require("express");
const { MongoClient } = require('mongodb');
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