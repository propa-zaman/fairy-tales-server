const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5002;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ffbuav.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoriesCollection = client.db('fairyTales').collection('categories');
    const allToysCollection = client.db('fairyTales').collection('allToys');

    // categories
    app.get('/categories', async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await categoriesCollection.findOne(query);
      res.send(result);
    })

    // allToys
    app.get('/allToys', async (req, res) => {
      console.log(req.query.SellerEmail);
      let query = {};
      if (req.query?.SellerEmail) {
        query = { SellerEmail: req.query.SellerEmail }
      }
      const result = await allToysCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await allToysCollection.findOne(query);
      res.send(result);
    })

    app.post('/allToys', async (req, res) => {
      const addedToys = req.body;
      console.log(addedToys);
      const result = await allToysCollection.insertOne(addedToys);
      res.send(result);
    });

    app.patch('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedAddedToy = req.body;
      console.log(updatedAddedToy);
      const updateDoc = {
          $set: {
              status: updatedAddedToy.status
          },
      };
      const result = await allToysCollection.updateOne(filter, updateDoc);
      res.send(result);
  })

  app.delete('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.deleteOne(query);
      res.send(result);
  })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('fairy is running')
})

app.listen(port, () => {
  console.log(`Fairy tales Server is running on port ${port}`)
})
