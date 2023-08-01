import express from "express";
export const router = express.Router();
import { db } from "../app.mjs";

router.get('/', (req, res)=>{
    res.send(db.databaseName);
})