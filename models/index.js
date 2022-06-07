const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // <=  Connection URI

// throw an error, if mongodb uri is not found
if (!uri) throw new Error("Please add your Mongo URI to env variables");

// for the livetime of the app, we don't want to keep connecting and connecting
// we'll try to cache our connetion
// let cachedClient = null;
// let cachedDb = null;

// // we'll export our collections here, once connection is established
// // const collections = async (db) => {
// const collections = (db) => {
//   const Profiles = db.collection("profiles");
//   // const Suggestions = db.collection("suggestions");
//   // const Profiles = db.collection("profiles");

//   return {
//     Profiles,
//     // Suggestions,
//     // Profiles,
//   };
// };

let Profiles;

async function run() {
  // async function connectToDatabase() {
  // check if we've cached a connection previously, if so use cached connection
  if (cachedClient) {
    console.log("connected previously");
    // return  collections();
  }

  // // Create a new MongoClient
  const client = new MongoClient(uri);

  // // create new MongoDB connection
  // const client = await MongoClient.connect(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  try {
    // create a new database instance, using dbname passed in the MongoDB URI
    await client.connect();

    // store connection instance in cache
    cachedClient = client;
    // cachedDb = db;

    // return collections(db);

    // Connect the client to the server
    // await client.connect(); // Connect to the MongoDB cluster
    // await client.db("admin").command({ ping: 1 }); // Establish and verify connection

    Profiles = await client.db().collection("profiles");

    // p = await client.db().collection("profiles");
    console.log({ Profiles });
    console.log("Connected successfully to server");
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

// exports. = Profiles;

console.log("Profiles*****", Profiles);

exports.Profiles = Profiles;

// export default collections;
