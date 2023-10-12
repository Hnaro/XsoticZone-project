import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';
import { match } from 'assert';

// watch movement of each player
router.post('/playerMove', async (req, res) => {
    // database collections
    // matches collection
    const matchCollections = db.collection("matches");
    // create model for matches collections
    const moveModel = { 
        playerID: req.body.playerUUID,
        sessionID: req.body.sessionUUID,
        playerMove: req.body.playerMove,
        matchplayerWinnerID: ""
    }

    // look for session if session uuid exists
    const sessionCollection = db.collection("sessions");
    const sessionUUID = await sessionCollection.findOne({sessionID: req.body.sessionUUID});
    const playerSeshUUID = await matchCollections.findOne({sessionID: req.body.sessionUUID});
    // if sessionUUID exists then insert move
    if (sessionUUID) {
        // if playerSeshUUID doesnt exist then insertOne if not then updateOne
        if (!playerSeshUUID) {
            const results = await matchCollections.insertOne(moveModel);
            res.send({ response: "202"});
        } else {
            const results = await matchCollections.updateOne({"sessionID": req.body.sessionUUID}, { $set: { "playerMove": req.body.playerMove }});
            res.send({ response: "202"});
        }
    } else {
        res.send({response: "404"});
    }
});

// creates the session with UUID
router.post('/createSession', async (req, res) => {
    // generate uuid here when create
    // generate playerUUID
    const playerUUID = req.body.hostName+"+"+uuidv4();
    // generate sessionUUID
    const sessionUUID = req.body.hostName+"-sesh+"+uuidv4();
    // get input name eg. (req.body.hostName)
    const hostname = req.body.hostName;
    // get collection 
    const sessionCollection = db.collection("sessions");
    // create model for sessions
    const session = { 
        playerID: playerUUID,
        sessionID: sessionUUID,
        host: hostname
    }
    // save to database
    const result = await sessionCollection.insertOne(session);

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

// end session 
router.post('/endSesh', async (req, res) => {
    // delete current session ID related
    const deleteQuery = {"sessionID":req.body.sessionUUIDSeed}
    const sessionCollection = db.collection("sessions");
    const matchCollection = db.collection("matches");
    const matchRes = await matchCollection.deleteOne(deleteQuery);
    const seshRes = await sessionCollection.deleteOne(deleteQuery);
    req.send({ endSeshStatus: "202 ok!!"});
});