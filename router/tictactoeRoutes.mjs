import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';
import { match } from 'assert';

// watch movement of each player
router.post('/playerMove', async (req, res) => {
    // database collections
    // matches collection
    let myArray= new Array(3);
    myArray.length
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

// update player status if ready
router.post('/updateMatchStatus', async (req, res) => {
    const matchCollection = await db.collection("matches");
    // check first if current status to update is host or other player
    // temporary variable for player ID
    let currentPlayerID = "";
    // first get playerid if its host or other player
    matchCollection.findOne({sessionID: req.body.sessionUUIDSeed, playerID: req.body.playerUUID})
    .then(body => {
        // gets the player id then update
        console.log(body);
    });
/*     const matchRes = matchCollection.updateOne({"sessionID": req.body.sessionUUIDSeed, }, {
        $set: {
            "isPlayerReady": req.body.playerStatus
        }
    })
    matchRes.then(obj => {
        res.send({msg: "playerReadyUpdated"})
    }); */
});

// contionus send of data to monitor movement
router.post('/getMatch', async (req, res) => {
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
        playerID: hostUUID,
        // current session
        sessionID: sessionUUID,
        // current player moves
        playerMove: null,
        // player status means if hes ready or if he is host then means if both true means games start
        // default false
        isPlayerReady: false
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

// update session Winner 
router.post('/sessionWinner', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    let updateRes = sessionCollection.updateOne({"sessionID": req.body.sessionUUIDSeed },{$set: {
        "winnerID": req.body.winnerUUIDSeed
    }})

    let findRes = sessionCollection.findOne({sessionID: req.body.sessionUUIDSeed});
    findRes.then(body => {
        if (body.opponentID == req.body.winnerUUIDSeed) {
            res.send({ winnerName: body.opponentName});
        } else {
            res.send({winnerName: body.hostName});
        }
    })
})

// join session
router.post('/joinSession', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    const matchCollection = await db.collection("matches");
    let opponentName;
    let opponentUUID;
    let noNameMsg;
    // match collection model
    const matchModel = { 
        // this checks for whoever is player id moved
        playerID: opponentUUID,
        // current session
        sessionID: req.body.sessionUUIDSeed,
        // current player moves
        playerMove: null,
        // player status means if hes ready or if he is host then means if both true means games start
        // default false
        isPlayerReady: false
    }
    // add another player match for opponent/other player
    matchCollection.insertOne(matchModel)
    .then(body => {
        console.log(body);
    });
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