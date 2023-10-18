import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';

// watch movement of each player
router.post('/playerMove', async (req, res) => {
    // database collections
    // matches collection
    const matchCollections = db.collection("matches");
    // create model for matches collections
    const moveModel = { 
        // this checks for whoever is player id moved
        playerID: req.body.playerUUID,
        // current session
        sessionID: req.body.sessionUUID,
        // current player move
        playerMove: req.body.playerMove
    }
    // look for session if session uuid exists
    const sessionCollection = db.collection("sessions");
    const sessionUUID = await sessionCollection
    .findOne({sessionID: req.body.sessionUUID});
    const playerSeshUUID = await matchCollections
    .findOne({sessionID: req.body.sessionUUID});
    // if sessionUUID exists then insert move
    if (sessionUUID) {
        // if playerSeshUUID doesnt exist then insertOne 
        // if not then updateOne
        if (!playerSeshUUID) {
            const results = await matchCollections
            .insertOne(moveModel);
            res.send({ response: "202"});
        } else {
            const results = await matchCollections
            .updateOne({"sessionID": req.body.sessionUUID}, 
            { $set: { "playerMove": req.body.playerMove }});
            res.send({ response: "202"});
        }
    } else {
        res.send({response: "404"});
    }
});

// creates the session with UUID
router.post('/createSession', async (req, res) => {
    const sessionCollection = db.collection("sessions");
    // generate uuid here when create
    // generate playerUUID
    const hostUUID = req.body.hostName+"+"+uuidv4();
    // generate sessionUUID
    const sessionUUID = req.body.hostName+"-sesh+"+uuidv4();
    // get input name eg. (req.body.hostName)
    const hostname = req.body.hostName;
    // get collection 
    // create model for sessions
    const session = { 
        hostID: hostUUID,
        sessionID: sessionUUID,
        hostName: hostname,
        opponentName: "",
        opponentID: "",
        winnerID: ""
    }
    const result = await sessionCollection.insertOne(session);
    // uuid for sessionUUID 
    if (result.acknowledged && req.body.hostName) {
        // save to database
        res.send({res: session, isCreated: true});
    } else {
       res.send({isCreated: false});
    }
});

// join session
router.post('/joinSession', async (req, res) => {
    const sessionCollection = db.collection("sessions");
    let opponentName;
    let opponentUUID;
    let noNameMsg;
    // generate current player joining UUID
    let name = sessionCollection.find({opponentName: req.body.opponentName});
    if (name) {
        opponentName = req.body.opponentName;
        opponentUUID = opponentName+"+"+uuidv4();
    } else {
        noNameMsg = "name already exist!"
    }
    // update session collection
    sessionCollection
    .updateOne({"sessionID": req.body.sessionUUIDSeed}, 
    {$set: {
        "opponentName": opponentName,
        "opponentID": opponentUUID
    }});
    // search data
    // check collection if sessionUUID is match with req.body.sessionUUIDSeed
    // get collection
    // iterate through collection
    const result = await sessionCollection
    .findOne({sessionID: req.body.sessionUUIDSeed});
    // if couldnt find send error message "couldn't find session please provide valid sessionUUID"
    // sessionUUID should recieved here
    if (result) {
       res.send({ data: result });
    } else {
        let message = name ? "couldn't find session please provide valid sessionID" : noNameMsg;
       res.send({ msg: message});
    }
});

// check who wins?
router.get('/winner', async (req, res) => {
    // if there is a winner put it in the match board
});

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