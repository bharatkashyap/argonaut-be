const express = require('express');
const dotenv = require('dotenv');
//const airtable = require('airtable');
const algosdk = require('algosdk');

const atoken = "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
const aserver = "http://hackathon.algodev.network";
const aport = 9100;
const us = "CXY4WAAPMNWEFHNAHEGZBZPCKZPKKVXN3TG6RNC6LABFHRM6C3274ZFAEM"
const mnem_us = "faculty scissors basket wish embrace verb narrow front canal enemy melt pencil crane lock success poem remember force ring dream salmon twice attack about fun";

const store =
{

    "sellers": [
        {
            "id": "R2BTV362CWRMCIC3HSRLWDNBLIFGCHSFSGMDLVMQEFBVP4OPL6EXECQWGA",
            "buyers": [],
            "transactions": []
        }
    ],
    "buyers": [
        {
            "id": "LQUF6YRKBMJSUPUTWMPLWR66GGC4PARNSUPR2ELFJIPD4NZWTPL47SUDXM",
            "name": "",
            "mnem": "",
            "transactions": []
        }
    ],
    "transactions": []
    
}


const bodyParser = require('body-parser');


if(process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv');
    dotenv.config();
}

const app = express();
app.use(express.static("./"));
let port = process.env.PORT || 3000;

const fs = require('fs');


// const airtableAPIKey = process.env.AIRTABLE_API_KEY;
// const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const argoBearerToken = process.env.ARGO_BEARER_TOKEN;
// const base = new airtable({apiKey: airtableAPIKey}).base(airtableBaseId);
// const airtableConfig = {
//     posts: "Posts",
//     comments: "Comments",
//     users: "Users",
//     tags: "Tags"
// }


app.use( (req, res, next) => {
    if(req.method === "OPTIONS") res.header('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : "*");
    else res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    next();
})


app.use(bodyParser.json());


app.get("/", index);
app.post("/upload", handleUpload);
// app.get("/comments", fetchComments);
// app.get("/posts", fetchPosts);
// app.get("/post/:id", fetchPost);
// app.get("/tags", fetchTags);
// app.post("/like", validateToken, likePost);
// app.post("/comment", validateToken, postComment);
// app.post("/user", validateToken, fetchUser);
app.get("/user", validateToken, fetchUser);
app.get("/users", validateToken, fetchUsers);
app.post("/transact", validateToken, doTransaction);
app.get("/transactions", validateToken, fetchTransactions);

const indexComponent = require('./index');


function index(req, res) {
    res.send(indexComponent.template);
}

function validateToken(req, res, next) {
    next();
    // const authorizationHeader = req.headers.authorization;
    // if(authorizationHeader) {
    //     const token = authorizationHeader.split(' ')[1];
    //     if (token === argoBearerToken) next();
    //     else {
    //         result = {
    //             status: 401,
    //             error: 'Unauthorized.'
    //         }
    //         res.status(401).send(result);
    //     }
    // }
    // else {
    //     result = {
    //         status: 403,
    //         error: 'Forbidden.'
    //     }
    //     res.status(403).send(result);
    // }
}

function handleUpload(req, res) {
    const seller = {"id": req.body.id};
    store.sellers.push(seller);
    res.status(200).send("OK");
    console.log(store.sellers);
}

function fetchUsers(req, res) {
    res.send(store.users);
}

async function doTransaction(req, res) {
    let { from, to, algos, mnem, name, meta } = req.body;
    // from is Buter
    // to is Seller
    const algodclient = new algosdk.Algod(atoken, aserver, aport);
    let fr = await algodclient.status();
    let fround = fr.lastRound;
    let lround = fround + 1000;
    let apiKey = 5;

    txnToSeller = {
        "from": from,
        "to": to,
        "fee": 1000,
        "amount": algos,
        "firstRound": fround,
        "lastRound": lround,
        "note": algosdk.encodeObj(name),
        "genesisID": "testnet-v1.0",
        "genesisHash": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
    };

    let recovered_account = algosdk.mnemonicToSecretKey(mnem);
    let secretKey = recovered_account.sk;

    var signedTxnToSeller = algosdk.signTransaction(txnToSeller, secretKey);

    try {
        let tx = await algodclient.sendRawTransaction(signedTxnToSeller.blob);
        var textedJson = JSON.stringify(tx, undefined, 4);
        let seller = store.sellers.find(t => t.id === to);
        seller.transactions.push({"name": name, "amount": algos});
    } catch (e) {   
        console.log(e);
    };

    txnToUs = {
        "from": from,
        "to": us,
        "fee": 1000,
        "amount": 100000,
        "firstRound": fround,
        "lastRound": lround,
        "note": algosdk.encodeObj(name),
        "genesisID": "testnet-v1.0",
        "genesisHash": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
    };

    var signedTxnToUs = algosdk.signTransaction(txnToUs, secretKey);
    try {
        let tx = await algodclient.sendRawTransaction(signedTxnToUs.blob);
        // res.status(200).send(store);
    } catch (e) {   
        console.log(e);
    };

    txnToBuyer = {
        "from": us,
        "to": from,
        "fee": 1000,
        "amount": 100000,
        "firstRound": fround,
        "lastRound": lround,
        "note": algosdk.encodeObj(name),
        "genesisID": "testnet-v1.0",
        "genesisHash": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
    };

    let recovered_account_us = algosdk.mnemonicToSecretKey(mnem_us);
    let secretKey_us = recovered_account_us.sk;

    var signedTxnToBuyer = algosdk.signTransaction(txnToBuyer, secretKey_us);

    try {
        let tx = await algodclient.sendRawTransaction(signedTxnToBuyer.blob);
        var textedJson = JSON.stringify(tx, undefined, 4);
        let buyer = store.buyers.find(t => t.id === from);
        buyer.transactions.push( {"key": apiKey, "meta": meta});
        res.status(200).send(store);
    } catch (e) {   
        console.log(e);
    };
}

async function fetchTransactions(req, res) {
    const user = req.body.account;
    const type = req.body.type;
    let seller, buyer;
    if(type === "seller") seller = store.sellers.find(t => t.id === user);
    else buyer = store.buyers.find(t => t.id === user);
    try {
        const algodclient = new algosdk.Algod(atoken, aserver, aport);
        let tx = await algodclient.accountInformation(account);
        let textedJson = JSON.stringify(tx, undefined, 4);
        //console.log(textedJson);
        let response = {"transactions": seller.transactions, "balance": textedJson.amount }
        res.status(200).send(response);
    } catch (e) {
        console.log(e);
    };
}

// function fetchPosts(req, res) {
//     base(airtableConfig.posts).select({
//         sort: [{
//             field: "Date", 
//             direction: "desc"
//         }]
//     }).eachPage(function page(records, fetchNextPage) {
//         // This function (`page`) will get called for each page of records.
        
//         res.write(JSON.stringify(records));
        
    
//         // To fetch the next page of records, call `fetchNextPage`.
//         // If there are more records, `page` will get called again.
//         // If there are no more records, `done` will get called.
//         fetchNextPage();
    
//     }, function done(err) {
//         if (err) { console.error(err); return; }
//         res.end();
//     });
// }

// function fetchPost(req, res) {
//     const id = req.params.id;
//     base(airtableConfig.posts).find(id, (err, record) => {
//         if(err) { console.error(err); return; res.status(501).send(err); }
//         res.status(200).send(record);
//     });
// }

// function fetchTags(req, res) {
//     base(airtableConfig.tags).select({}).eachPage( function page(records, fetchNextPage) {
//         res.write(JSON.stringify(records));
//         fetchNextPage();
//     }, function done(err) { 
//         if(err) { console.error(err); return; }
//         res.end();
//     })
// }

// function fetchComments() {

// }

// async function findUser(user) {
    
//     let foundUserFlag = false;
//     let foundUser = new Promise( (resolve, reject) => {
        
//         base(airtableConfig.users).select({}).eachPage(function page(records, fetchNextPage) {
            
//             records.some(function(record) {
//                 if(record.get('email') === user.email) { foundUserFlag = true; resolve(record); }
//             });
//             fetchNextPage();
//         }, function done(err) {
//             if(err) { console.error(err); }
//             if(foundUserFlag === false) { resolve(null) }
//         })

//     });
    
//     return await foundUser;

// }

async function fetchUser(req, res) {
    // const user = req.body.user;
    // const account = req.body.account;
    const account = req.query.account;
   
    try {
        const algodclient = new algosdk.Algod(atoken, aserver, aport);
        let tx = await algodclient.accountInformation(account);
        let textedJson = JSON.stringify(tx, undefined, 4);
        console.log(textedJson);
        res.status(200).send(textedJson);
    } catch (e) {
        console.log(e);
    };

}

// async function likePost(req, res) {
    // const user = req.body.user;
    // const posts = req.body.posts;
    // let likedPosts = new Promise( (resolve, reject) => {
        // base(airtableConfig.users).update(user, {
            // "Likes": posts
        // }, (err, record) => {
            // if(err) { console.error(err); reject(false); return; }
            // resolve(record.get('Likes'));
        // })
    // });
// 
    // res.status(200).send(await likedPosts);
// }

// function postComment(req, res) {
    // base(airtableConfig.comments).create(req.body.payload, function(err, record) {
        // if(err) { console.error(err); return; }
        // res.status(200).send(record.getId());
    // });
// }


app.listen(port, console.log("Backend running on port", port));