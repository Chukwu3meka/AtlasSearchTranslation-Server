const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI; // <=  Connection URI

// throw an error, if mongodb uri is not found
if (!uri) throw new Error("Please add your Mongo URI to env variables");

// Connection URL
const client = new MongoClient(uri);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  // const db = client.db(dbName);

  // const collection = db.collection("documents");

  // the following code examples can be pasted here...

  return "done.";
}

main().then(console.log).catch(console.error);
// .finally(() => client.close());

exports.Suggestions = client.db().collection("suggestions");
exports.Greetings = client.db().collection("greetings");
exports.Profiles = client.db().collection("profiles");
