import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://keeansmith1:keens@cosc4353.onpjljk.mongodb.net/?retryWrites=true&w=majority&appName=COSC4353";

const client = new MongoClient(uri);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db("COSC4353");
export default db;
