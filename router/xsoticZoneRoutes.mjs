import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { json } from 'node:stream/consumers';

router.post('/matchMove', async (req, res) => {
    // database collections
    const matchCollections = db.collection("matches");
    const moveModel = {
        move: "c1r1",
        player: "john"
    }
    console.log(req.body);
    //const results = await matchCollections.insertOne(moveModel);
    //console.log(results);
    res.send(req.body);
})