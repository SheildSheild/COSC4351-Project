import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://keeansmith1:keens@cosc4353.onpjljk.mongodb.net/?retryWrites=true&w=majority&appName=COSC4353";

let client;
let db;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to database!");
    db = client.db("COSC4353");
  }
  return db;
};

export default connectToDatabase;
