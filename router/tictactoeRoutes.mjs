import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';

// watch movement of each player record exit 
router.post('/matchMove', async (req, res) => {
    // database collections
    // matches collection
    const matchCollections = db.collection("matches");
    const moveModel = { 
        move: req.body.move,
        player: req.body.playerName
    }
    console.log(moveModel); 
    console.log(req.body);
    const results = await matchCollections.insertOne(moveModel);
    console.log(results);
    //const results = await matchCollections.updateOne({player: "john"},{move:"c2r1"})
    if (req.body) {
        res.send({ response: "status ok", 
        sentName: req.body.playerName, 
        sentMove: req.body.move 
    })
    } else {
        res.send({response: "status error"});
    }
});

// creates the session with UUID
router.post('/createSession', async (req, res) => {
    // generate uuid here when create
    // generate playerUUID
    const playerUUID = req.body.hostName+"+"+uuidv4();
    console.log(playerUUID);
    // generate sessionUUID
    const sessionUUID = req.body.hostName+"-sesh+"+uuidv4();
    console.log(sessionUUID);
    // get input name eg. (req.body.hostName)
    const hostname = req.body.hostName;
    // get collection 
    const matchCollections = db.collection("sessions");
    // create model for sessions
    const session = { 
        playerID: playerUUID,
        sessionID: sessionUUID,
        host: hostname
    }
    // save to database
    const result = await matchCollections.insertOne(session);

    // uuid for sessionUUID 
    if (req.body.hostName) {
        res.send("created session complete!!");
    } else {
       res.send("session not created!");
    }
});


// create player
router.post('/joinSession', async (req, res) => {
    // generate current player joining UUID
    // search data
    // check collection if sessionUUID is match with req.body.sessionUUIDSeed
    // get collection
    const matchCollections = db.collection("sessions");
    // iterate through collection
    const result = await matchCollections.findOne({sessionID: req.body.sessionUUIDSeed});
    // if couldnt find send error message "couldn't find session please provide valid sessionUUID"
    // sessionUUID should recieved here
    console.log(result.sessionID);
    if (result) {
       res.send("joined!!");
    } else {
       res.send("couldn't find session please provide valid sessionUUID");
    }
})