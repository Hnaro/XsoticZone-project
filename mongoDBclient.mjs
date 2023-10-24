import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// connnection to databse

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const dbclient = new MongoClient("mongodb+srv://mclay:y9R3rLMApeZaC9EH@cluster0.id7o3on.mongodb.net/?retryWrites=true&w=majority");
export const rundb = () => {
  dbclient.connect().then(success => {
    console.log("database connected!!");
  }).catch(err => {
    console.log("databse not connected!!")
  })
}
