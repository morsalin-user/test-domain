import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("MONGODB_URI is not set")

const options = {
  maxPoolSize: 10,
  compressors: 'none', // ✅ Disable native compression (no snappy/zstd)
}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDb() {
  const conn = await clientPromise
  const dbName = process.env.MONGODB_DB || "media_vault"
  return conn.db(dbName)
}
