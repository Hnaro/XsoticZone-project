import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';

// watch movement of each player
router.post('/playerMove', async (req, res) => {
    // database collections
    // matches collection
    const matchCollections = await db.collection("matches");
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
    const sessionCollection = await db.collection("sessions");
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
            res.send({ response: "404"});
        } else {
            const results = await matchCollections
            .updateOne({ 
                "sessionID": req.body.sessionUUID}, 
            { $set: { "playerID": req.body.playerUUID,"playerMove": req.body.playerMove }});
            res.send({ response: "202"});
        }
    } else {
        res.send({response: "404"});
    }
});

// contionus send of data to monitor movement
router.post('/getMatchMove', async (req, res) => {
    const matchCollection = await db.collection("matches");
    const matchRes = matchCollection.findOne({sessionID: req.body.sessionUUIDSeed});
    matchRes.then(body => {
        res.send(body);
    }).catch(err => {
        console.log(err);
    })
})

// creates the session with UUID
router.post('/createSession', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    const matchCollections = await db.collection("matches");
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
    //match data model
    const moveModel = { 
        // this checks for whoever is player id moved
        playerID: null,
        // current session
        sessionID: sessionUUID,
        // current player move
        playerMove: null
    }
    const matchResult = await matchCollections.insertOne(moveModel);
    const result = await sessionCollection.insertOne(session);
    // uuid for sessionUUID 
    if (result.acknowledged && req.body.hostName) {
        // save to database
        res.send({res: session, matchRes: matchResult ,isCreated: true});
    } else {
       res.send({isCreated: false});
    }
});

router.post('/findSession', async (req, res) => {
    // first get collection
    const sessionCollection = await db.collection("sessions");
    // next find collection using session collection 
    let result = await sessionCollection.findOne({sessionID: req.body.sessionUUIDSeed});
    if (result) {
        res.send({data: result});
    } else {
        res.send({msg: "Could not found Session ID!", delLocalStorage: true});
    }
});

// join session
router.post('/joinSession', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    let opponentName;
    let opponentUUID;
    let noNameMsg;
    // generate current player joining UUID
    let name = await sessionCollection.find({opponentName: req.body.opponentName});
    if (name) {
        opponentName = req.body.opponentName;
        opponentUUID = opponentName+"+"+uuidv4();
    } else {
        noNameMsg = "name already exist!"
    }
    // update session collection
    await sessionCollection
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
        let message = name ? "Couldn't find session please provide valid sessionID" : noNameMsg;
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
    res.send({msg: "202 ok!!"});
});