require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpxrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("realEstateDB").collection("users");
    const wishListCollection = client.db("realEstateDB").collection("wishlist");
    const propertyCollection = client
      .db("realEstateDB")
      .collection("allProperties");

    // console.log(wishListCollection);
    // all users related api

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });

    // find one user

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const quer = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(quer);
      res.send(result);
    });


    // delete user 

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });


    


    // get all products

    app.get("/allproperties", async (req, res) => {
      const result = await propertyCollection.find().toArray();
      res.send(result);
    });

    // find one product

    app.get("/allproperties/:id", async (req, res) => {
      const id = req.params.id;
      const quer = { _id: new ObjectId(id) };
      const result = await propertyCollection.findOne(quer);
      res.send(result);
    });

    // add to wishlist

    app.post("/wishlist", async (req, res) => {
      const queryData = req.body;
      const result = await wishListCollection.insertOne(queryData);
      console.log(queryData);
      res.send({ wishedData: queryData, insertResult: result });
      // res.send(result);
    });

    app.get("/wishlist", async (req, res) => {
      const result = await wishListCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });

    // app.post("/wishlist", async(req, res)=> {
    //   const newEquipment = req.body;
    //   console.log('Creating new equipment',newEquipment);
    //   const result = await wishListCollection.insertOne(newEquipment);
    //   res.send(result);
    // })

    // app.get("/allproperties/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const quer = { _id: new ObjectId (id) };
    //   const result = await propertyCollection.findOne(quer);
    //   res.send(result);
    // });

    // app.get("/allproperties/:id", async (req, res) => {
    //   // const result = await propertyCollection.find().toArray();
    //   const result = await propertyCollection.findOne({ _id });
    //   // console.log(result, "this is result");
    //   res.send(result);
    // });

    // app.get("/allproperties/:_id", async (req, res) => {
    //   const result = await propertyCollection.find().toArray();
    //   console.log(result, "this is result");
    //   res.send(result);
    // });

    // delete properties

    app.delete("/allproperties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.deleteOne(query);
      res.send(result);
    });

    // get user role

    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send({ role: result?.role });
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running successfully ");
});

app.listen(port, () => {
  console.log(`server is running successfylly  ${port}`);
});
