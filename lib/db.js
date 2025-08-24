import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) throw new Error("Defina MONGODB_URI no .env.local");

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDB() {
  const client = await clientPromise;
  return client.db("wiki");
}
