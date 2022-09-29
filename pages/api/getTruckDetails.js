import { MongoClient } from "mongodb";

export default async function AddService(req, res) {
  const client = await MongoClient.connect("mongodb+srv://Sanjay:Sanjay@Mongo@cluster0.e5osssj.mongodb.net");
  const db = client.db();
  const userCollection = db.collection("log");
  const result = await userCollection.find().toArray();
  res.status(201).json({"services":result});
  client.close();
  
}