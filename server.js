const express = require('express');
const dotenv = require('dotenv');
const crypto = require("crypto");
//const airtable = require('airtable');
const algosdk = require('algosdk');

const atoken = "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
const aserver = "http://hackathon.algodev.network";
const aport = 9100;
const us = "CXY4WAAPMNWEFHNAHEGZBZPCKZPKKVXN3TG6RNC6LABFHRM6C3274ZFAEM"
const mnem_us = "faculty scissors basket wish embrace verb narrow front canal enemy melt pencil crane lock success poem remember force ring dream salmon twice attack about fun";

const divisionFactor = 0.01;

const store =
{
    "sellers": [
        {
            "id": "ODVLQILOZCMY5FNINSIMEYKWGXQUXQP27IIJBGBIG4LFXX6GAGH4PSIL2I",
            "buyers": [],
            "transactions": [
                {
                    "name": "MIT Transit Lab",
                    "amount": 25000000
                },
                {
                    "name": "Massport",
                    "amount": 32500000
                },
                {
                    "name": "Street light survey - City of Cambridge",
                    "amount": 12500000
                }
            ]
        },
        {
            "id": "5SSKQXWACBNY2G4M5PUBZOZOBBBRTHYUZQ3UD2OEMOGFCXJEMLDAK7ZE7M",
            "buyers": [],
            "transactions": [
                {
                    "name": "MIT Transit Lab",
                    "amount": 25000000
                },
                {
                    "name": "Massport",
                    "amount": 32500000
                },
                {
                    "name": "Street light survey - City of Cambridge",
                    "amount": 12500000
                }
            ]
        },
        {
            "id": "QYIAZNEV7DQGNZ2QSFVEBRDDFAL4CALFTN5VQ2QZKYZ4YB7THGFSP6DT2A",
            "buyers": [],
            "transactions": [
                {
                    "name": "Massport",
                    "amount": 32500000
                },
                {
                    "name": "Street light survey - City of Cambridge",
                    "amount": 12500000
                }
            ]
        },
        {
            "id": "PPVZQQLXRR6NUOVIDRCQCD7NDQLPVCEEJI5NGBW2RFOD3WYN6VQ3WMDW34",
            "buyers": [],
            "transactions": [
                {
                    "name": "Street light survey - City of Cambridge",
                    "amount": 12500000
                }
            ]
        }
    ],
    "buyers": {
        "LQUF6YRKBMJSUPUTWMPLWR66GGC4PARNSUPR2ELFJIPD4NZWTPL47SUDXM": {
            "name": "MIT Transit Lab",
            "mnem": "",
            "transactions": [
                {
                    "key": "ca6b76bb6b71408a35caec55af836a319fda6b8a"
                }
            ]
        },
        "AXBVGTXWLPSSY6CRU3QQ3RSWRLQNOGTKI3U2346MRHJJN6NGHT72O37YV4": {
            "name": "Massport",
            "mnem": "",
            "transactions": [
                {
                    "key": "3fb3c378b2d9d47d08f1a8b9682fb70dc4733914"
                }
            ]
        },
        "3ZTFRHYZDB37LQUKXQUVEXH5BPKABIRTINCVRUXGFK36ICDZ2P2P4EFRJQ": {
            "name": "Street light survey - City of Cambridge",
            "mnem": "",
            "transactions": [
                {
                    "key": "f616e3b8de79ab821fbad6d21d79411c9d5a3963"
                }
            ]
        },
        "Y3GJ5UQZKETGOGXU43CZQFB2RD3FCPNXVOXIE5AG7SHMOE2FXQZCVAWK3A": {
            "name": "Massachusetts Bay Transportation Authority",
            "mnem": "",
            "transactions": []
        }
    },
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
    let { from, algos, mnem, meta } = req.body;
    // from is Buter
    // to is Seller
    
    const algodclient = new algosdk.Algod(atoken, aserver, aport);
    let fr = await algodclient.status();
    let fround = fr.lastRound;
    let lround = fround + 1000;
    let apiKey = crypto.randomBytes(20).toString('hex');

    let name = store.buyers[from] && store.buyers[from].name;

    store.sellers.forEach(async (seller) => {
        
        let to = seller.id;

        txnToSeller = {
            "from": from,
            "to": to,
            "fee": 1000,
            "amount": algos*divisionFactor,
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
            seller.transactions.push({"name": name, "amount": algos});
        } catch (e) {   
            console.log(e);
        };
    });

    let recovered_account = algosdk.mnemonicToSecretKey(mnem);
    let secretKey = recovered_account.sk;

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
        //let buyer = store.buyers.find(t => t.id === from);
        let buyer = store.buyers[from];
        buyer.transactions.push( {"key": apiKey, "meta": meta});
        res.status(200).send(store);
    } catch (e) {   
        console.log(e);
    };
}

async function fetchTransactions(req, res) {
    const account = req.query.account;
    const type = req.query.type;
    let seller, buyer;
    if(type === "seller") seller = store.sellers.find(t => t.id === account);
    else buyer = store.buyers[account];
    
    try {
        const algodclient = new algosdk.Algod(atoken, aserver, aport);
        let tx = await algodclient.accountInformation(account);
        let amount = tx.amount;
        let textedJson = JSON.stringify(tx, undefined, 4);
        let response = {};
        
        console.log(seller, buyer);
        if(seller) response["transactions"] = seller.transactions;
        else response["transactions"] = buyer.transactions;
        response["amount"] = amount;
        console.log(response);
        res.status(200).send(response);
    } catch (e) {
        console.log(e);
    };
}


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

app.listen(port, console.log("Backend running on port", port));