import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { json } from 'node:stream/consumers';

// watch movement of each player record it 
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
    const results = await matchCollections.updateOne({player: "john"},{move:"c2r1"})
    res.send(results);
});

// creates the session with UUID
router.post('/createSession', async (req, res) => {

});

// create player
router.post('/createPlayer', async (req, res) => {

})