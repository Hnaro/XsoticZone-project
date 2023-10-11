import express from "express";
export const router = express.Router();
import { db } from "../app.mjs";

router.get('/', (req, res)=>{
    // to check wether the backend is connected to the database
    res.send({ responseStatus: "202"});
});