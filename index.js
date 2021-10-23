const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//db-pass- Ic0A3kyFYQDzmhHZ
//db-user :Product_manage

const uri =
  "mongodb+srv://Product_manage:Ic0A3kyFYQDzmhHZ@cluster0.oybbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Products");
    const UserProductsCollection = database.collection("UserProducts");

    //get api
    app.get("/products", async (req, res) => {
      const result = await UserProductsCollection.find({}).toArray();
      res.send(result);
    });
      
    // create a document to insert
    //post api
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await UserProductsCollection.insertOne(products);
      //   console.log("get the product", products);
      res.json(result);
    });
      
    //delete api
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await UserProductsCollection.deleteOne(query);
    //   console.log("hitting the document", result);
      res.json(result);
    });
      
      //find api 
      app.get('/products/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await UserProductsCollection.findOne(query);
        //   console.log(result);
          res.send(result);
      })
      //update/put api
      app.put('/products/:id', async (req, res) => {
          const id = req.params.id;
          const update = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
                  ProductName: update.ProductName,
                  ProductPrice: update.ProductPrice,
                  ProductQuantity: update.ProductQuantity,
            },
          };
          const result = await UserProductsCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(result) 
      })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send("Hitting the server");
})

app.listen(port, () => {
    console.log("listening on port",port);
})