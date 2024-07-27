import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://keeansmith1:<password>@cosc4353.onpjljk.mongodb.net/?retryWrites=true&w=majority&appName=COSC4353";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsInsecure: true,
});

let conn;
let db;

async function connectToDatabase() {
  try {
    conn = await client.connect();
    db = conn.db("COSC4353");
    console.log("Connected to database!");
  } catch (e) {
    console.error("Failed to connect to database", e);
  }
}

await connectToDatabase();

export default db;