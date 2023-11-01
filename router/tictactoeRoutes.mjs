import * as express from 'express';
export const router = express.Router();
import { db } from '../app.mjs';
import { v4 as uuidv4 } from 'uuid';
import { match } from 'assert';

// watch movement of each player
router.post('/playerMove', async (req, res) => {
    // database collections
    // matches collection
    const sessionCollection = await db.collection("sessions");
    const matchMoveCollections = await db.collection("matchMoves");
    //match data model
    const moveModel = { 
        // this checks for whoever is player id moved
        playerID: req.body.playerUUID,
        // current session
        sessionID: req.body.sessionUUID,
        // current player moves
        playerMove: req.body.playerMove
    }
    // look for session if session uuid exists
    const sessionUUID = await sessionCollection
    .findOne({sessionID: req.body.sessionUUID});
    // if sessionUUID exists then insert move
    if (sessionUUID) {
        // if playerSeshUUID doesnt exist then insertOne 
        await matchMoveCollections.insertOne(moveModel);
        res.send({ response: "404"});
    } else {
        res.send({response: "404"});
    }
});

// update player status if ready
router.post('/updateMatchStatus', async (req, res) => {
    const matchCollection = await db.collection("matches");
    // check first if current status to update is host or other player
    // first get playerid if its host or other player
    const matchRes = await matchCollection.findOne({sessionID: req.body.sessionUUIDSeed, playerID: req.body.playerUUID})
    if (matchRes) {
        if (matchRes) {
            // udpates the player status
            const result = await matchCollection.updateOne({"sessionID": req.body.sessionUUIDSeed,
            "playerID": req.body.playerUUID},{$set: {"isPlayerReady": req.body.playerStatus}});
            if (result.acknowledged) {
                res.send({msg: "success!!"});
            }
        }
    } else {
        res.send({errorMsg: "something went wrong!!"});
    }
});

//get playermatch Status
router.post('/getPlayerMatchStatus', async (req, res) => {
    const matchCollection = await db.collection("matches");
    const matchRes = await matchCollection.findOne({
        sessionID: req.body.sessionUUIDSeed,
        playerID: req.body.playerUUID,
    })
    if (matchRes) {
        res.send({ data: matchRes });
    } else {
        res.sendStatus(404);
    }
});

// restart match 
router.post('/restartMatch', async (req, res) => {
    // restart match delete all matchMoves of the match
    const matchMoveCollection = await db.collection("matchMoves");
    const matchesCollection = await db.collection("matches");
    const sessionCollection = await db.collection("sessions");
    await matchMoveCollection.deleteMany({sessionID:req.body.sessionUUIDSeed})
    .then(async (body) => {
        // set reload status to true
        const sessionRes = await sessionCollection.updateOne({"sessionID":req.body.sessionUUIDSeed}, {
            $set: {
                "sessionReloadStatus": true
            }
        });
        // set player match status to false
        const matchesRes = await matchesCollection.updateMany({"sessionID":req.body.sessionUUIDSeed}, {
            $set: {
                "isPlayerReady": false
            }
        });
        // set winner to null
        const sessionWinner = await sessionCollection.updateOne({"sessionID":req.body.sessionUUIDSeed},{
            $set: {
                "winnerID":null
            }
        })
        if (body && sessionWinner.acknowledged && matchesRes.acknowledged && sessionRes.acknowledged) {
            if (body) {
                res.sendStatus(202);
            } else {
                res.sendStatus(404);
            }
        }
    }).catch(err => {
        res.send({errMsg: "Something went wrong!!"});
    });
});

// getmatch moves
router.post('/getMatch', async (req, res) => {
    const matchMoveCollection = await db.collection("matchMoves");
    const matchRes = await matchMoveCollection.find({});

    if (matchRes) {
        let filteredItems = matchRes.toArray().then(obj => {
            return obj.filter(value => {
                return value.sessionID == req.body.sessionUUIDSeed && value.playerID == req.body.playerUUID;
            })
        });
        if ((await filteredItems).length == 0) {
            res.send({errMsg: "Match doesn't exist!"})
        } else {
            filteredItems.then(value => {
                console.log(value)
                res.send({result: value});
            });
        }
    } 
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
        opponentName: null,
        opponentID: null,
        firstTurnID: null,
        sessionReloadStatus: false,
        winnerID: null
    }
    const matchModel = { 
        // this checks for whoever is player id moved
        playerID: hostUUID,
        // current session
        sessionID: sessionUUID,
        // current player moves
        isPlayerReady: false
    }
    // inserts the match model for status model
    const matchRes = await matchCollections.insertOne(matchModel);
    const result = await sessionCollection.insertOne(session);
    // uuid for sessionUUID 
    if (result.acknowledged && req.body.hostName && matchRes.acknowledged) {
        res.send({res: session, isCreated: true});
    } else {
       res.send({isCreated: false});
    }
});

// finds session
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

// updates the reloadStatus
router.post("/updatesessionReloadStatus", async (req, res) => {
    // first get collection
    const sessionCollection = await db.collection("sessions");
    let sessionRes = await sessionCollection.updateOne({"sessionID":req.body.sessionUUIDSeed}, {
        $set: {
            "sessionReloadStatus": false
        }
    })
    if (sessionRes.acknowledged) {
        res.sendStatus(202);
    } else {
        res.sendStatus(404);
    }
});

// update session Winner 
router.post('/sessionWinner', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    const updateRes = sessionCollection.updateOne({"sessionID": req.body.sessionUUIDSeed },{$set: {
        "winnerID": req.body.winnerUUIDSeed
    }});
    if (updateRes) {
        res.sendStatus(202);
    } else {
        res.sendStatus(404);
    }
})

//gets the winner
router.post('/getsessionWinner', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    let findRes = sessionCollection.findOne({sessionID: req.body.sessionUUIDSeed});
    findRes.then(body => {
        if (body.opponentID == req.body.winnerUUIDSeed) {
            res.send({ winnerName: body.opponentName});
        } else {
            res.send({winnerName: body.hostName});
        }
    })
});

// join session
router.post('/joinSession', async (req, res) => {
    const sessionCollection = await db.collection("sessions");
    const matchCollection = await db.collection("matches");
    let opponentName;
    let opponentUUID;
    let noNameMsg;
    opponentName = req.body.opponentName;
    opponentUUID = opponentName+"+"+uuidv4();
    // match collection model
    const matchModel = { 
        // this checks for whoever is player id moved
        playerID: opponentUUID,
        // current session
        sessionID: req.body.sessionUUIDSeed,
        // player status means if hes ready or if he is host then means if both true means games start
        // default false
        isPlayerReady: false
    }
    // update session collection
    await sessionCollection
    .updateOne({"sessionID": req.body.sessionUUIDSeed}, 
    {$set: {
        "opponentName": opponentName,
        "opponentID": opponentUUID
    }});
    // inserts the match model for status model
    const matchRes = await matchCollection.insertOne(matchModel);
    const result = await sessionCollection
    .findOne({sessionID: req.body.sessionUUIDSeed});
    // if couldnt find send error message "couldn't find session please provide valid sessionUUID"
    // sessionUUID should recieved here
    if (result && matchRes.acknowledged) {
       res.send({ data: result });
    } else {
       res.send({ msg: message});
    }
});

// end session removes all data that has session id of current game
router.post('/endSesh', async (req, res) => {
    // delete current session ID related
    const deleteQuery = {"sessionID":req.body.sessionUUIDSeed}
    const sessionCollection = db.collection("sessions");
    const matchCollection = db.collection("matches");
    const matchMoveCollection = db.collection("matchMoves")
    const matchMove = await matchMoveCollection.deleteMany(deleteQuery);
    const matchRes = await matchCollection.deleteMany(deleteQuery);
    const seshRes = await sessionCollection.deleteOne(deleteQuery);
    res.send({msg: "202 ok!!"});
});