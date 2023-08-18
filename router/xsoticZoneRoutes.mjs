import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { json } from 'node:stream/consumers';

// watch movement of each player record it 
router.post('/matchMove', async (req, res) => {
    // database collections
    const matchCollections = db.collection("matches");
    const moveModel = {
        move: req.body.move,
        player: req.body.playerName
    }
    console.log(moveModel)
    console.log(req.body);
    const results = await matchCollections.insertOne(moveModel);
    console.log(results);
    //const results = await matchCollections.updateOne({player: "john"},{move:"c2r1"})
    if (req.body) {
        res.send({ response: "status ok", 
        sentName: req.body.playerName, 
        sentMove: req.body.move })
    } else {
        res.send({response: "status error"});
    }
});

// creates the session with UUID
router.post('/createSession', async (req, res) => {
    // generate uuid here when create
    // uuid for sessionUUID and s
    console.log(req.body)
    if (req.body) {
        res.send("created session complete!!");
    } else {
       res.send("session not created!");
    }
});

// create player
router.post('/joinSession', async (req, res) => {
    // generate current player joining UUID
    // sessionUUID should recieved here
    console.log(req.body)
    if (req.body) {
        res.send("created player complete!!");
    } else {
       res.send("player not created!");
    }
})