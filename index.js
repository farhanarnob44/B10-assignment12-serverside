require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_TOKEN);
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
    const paymentCollection = client.db("realEstateDB").collection("payment");
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

    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { id : {$ne: id} };
    //   const result = await userCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: { $ne: email } };
      const result = await userCollection.find(query).toArray();

      res.send(result);
    });

    // find user by email

    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send({ role: result?.role });
    });

    // delete user

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // update role

    app.patch("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const { role } = req.body;
      const filter = { email };
      const updatedDoc = {
        $set: { role },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // get all products

    app.get("/allproperties", async (req, res) => {
      const result = await propertyCollection.find().toArray();
      res.send(result);
    });

    // add to all properties

    app.post("/allproperties", async (req, res) => {
      const queryData = req.body;
      const result = await propertyCollection.insertOne(queryData);
      res.send(result);
    });

    // update properties

    app.put("/allproperties/:id", async (req, res) => {
      const id = req.params.id;
      const queryData = req.body;
      const updated = {
        $set: queryData,
      };
      const quer = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await propertyCollection.updateOne(quer, updated, options);
      console.log(queryData);
      res.send(result);
    });

    // app.post("/allProducts", async (req, res) => {
    //   const item = req.body;
    //   const result = await jewelaryCollection.insertOne(item);
    //   res.send(result);
    // });

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

      res.send({ wishedData: queryData, insertResult: result });
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

    // payment intent

    // app.post('/create-payment-intent', async (req ,res) => {
    //   const {price} = req.body
    //   const amount = parseInt(price * 100)

    //    const paymentIntent = await stripe.paymentIntents.create({
    //     amount : amount,
    //     currency: "usd",
    //     payment_method_types: ['card']
    //    })

    //    res.send({
    //     clientSecret: paymentIntent.client_Secret
    //    })
    // })

    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { price } = req.body;
        // console.log("Received price:", price);

        const amount = Number(price.replace(/,/g, "")) * 100;
        console.log("Calculated amount:", amount);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (err) {
        console.error("Stripe error:", err);
        res.status(500).send({ error: err.message });
      }
    });
    app.get("/payments", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    // app.post("/payments", async (req, res) => {
    //   const payment = req.body;
    //   const paymentResult = await paymentCollection.insertOne(payment);
    //   // currently delete each item
    //   console.log("payment Info", payment);

    //   const query = {
    //     _id: {
    //       $in: payment.wishlisthId.map((_id) => new ObjectId(_id)),

    //     },
    //   };

    //   const deleteResult = await wishListCollection.deleteMany(query);
    //   console.log(`${deleteResult.deletedCount} wishlist items deleted`);

    //   // const deleteResult = await wishListCollection.deleteOne(query);
    //   res.send({ paymentResult }, { deleteResult });
    // });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      console.log("payment Info", payment);

      const paymentResult = await paymentCollection.insertOne(payment);

      // SAFELY handle wishlist IDs
      if (payment.wishlisthId && Array.isArray(payment.wishlisthId)) {
        const validObjectIds = payment.wishlisthId
          .filter(
            (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
          )
          .map((id) => new ObjectId(id));

        if (validObjectIds.length > 0) {
          const query = { _id: { $in: validObjectIds } };
          const deleteResult = await wishListCollection.deleteOne(query);
          console.log(
            `Deleted ${deleteResult.deletedCount} items from wishlist`
          );
        } else {
          console.log("No valid ObjectIds found in wishlisthId");
        }
      }

      res.send({ success: true });
    });

    
    app.get("/payments/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email } ;
      const result = await userCollection.find(query).toArray();

      res.send(result);
    });

      //     const query = { email: req.params.email };
      // if (req.params.email !== req.decoded.email) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }


    console.log("STRIPE_SECRET_TOKEN:", process.env.STRIPE_SECRET_TOKEN);

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
