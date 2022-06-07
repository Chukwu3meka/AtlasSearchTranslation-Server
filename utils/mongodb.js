const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // <=  Connection URI

// throw an error, if mongodb uri is not found
if (!uri) throw new Error("Please add your Mongo URI to env variables");

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect(); // Connect to the MongoDB cluster
    await client.db("admin").command({ ping: 1 }); // Establish and verify connection
    console.log("Connected successfully to server");
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// export default connectToDatabase;
