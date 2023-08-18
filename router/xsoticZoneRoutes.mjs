import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { json } from 'node:stream/consumers';

// watch movement of each player record it 
router.post('/matchMove', async (req, res) => {
    // database collections
    // matches collection
    const matchCollections = db.collection("matches");
    try {
        // first check session before insrting the data 
        const moveModel = {
            sesssionUUID: req.body.sessUUID,
            playerUUID: req.body.playerUUID,
            playerMove: req.body.playerMove
        }
        // if session is already in the database update the playerMove 
        const dbsessionUUID = await matchCollections
        .findOne({sesssionUUID: req.body.sessUUID}, moveModel);
        // and playerUUID if not existing then insertOne
        if (!dbsessionUUID) {
            const results = await matchCollections.insertOne(moveModel);
        }
        console.log(results);
        //const results = await matchCollections.updateOne({player: "john"},{move:"c2r1"})
        if (req.body) {
            res.send({ response: "status ok", 
            sentName: req.body.playerName, 
            sentMove: req.body.move })
        } else {
            res.send({response: "status error"});
        }
    } catch(err) {
        console.log(err)
    } finally {
    
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