import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://keeansmith1:keens@cosc4353.onpjljk.mongodb.net/?retryWrites=true&w=majority&ssl=true";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

const connectToDatabase = async () => {
  try {
    if (!db) {
      await client.connect();
      db = client.db("COSC4353");
      console.log("Connected to database");
    }
    return db;
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e;
  }
};

export default connectToDatabase;