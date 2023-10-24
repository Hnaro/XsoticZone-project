import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// connnection to databse

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const dbclient = new MongoClient(process.env.URI);
export const rundb = () => {
  dbclient.connect().then(success => {
    console.log("database connected!!");
  }).catch(err => {
    console.log(err);
  })
}
