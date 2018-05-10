const express = require('express');
const app = express();
const Cache = require('./scripts/cache');
const Blockchain = require('./scripts/blockchain');
const bodyParser = require('body-parser');
const readline = require('readline');
const RSA = require('./rsa');
const fs = require('fs');

// Clears the screen; I think it only works on mac
process.stdout.write('\033c');

const blockchain = new Blockchain();

if (JSON.parse(Cache.readJSON())) {
  blockchain.chain = JSON.parse(Cache.readJSON()).chain;
} else {
  Cache.write(blockchain);
}

function validateIncomingBlockchain(incoming, current) {
  for (block of incoming.chain) {
    let {timestamp, previousHash, transactions, nonce} = block;

    newBlock = {
      timestamp,
      previousHash,
      transactions,
      nonce,
    }

    let newBlockHash = Blockchain.SHA(newBlock)

    if (newBlockHash !== block.hash) {
      return false
    };
  }
  return true
}
app.use(bodyParser.urlencoded())

app.use(bodyParser.json()) // Gives us access to body-parser

// GET Requests
app.get('/', (req, res) => {
  res.send(':)');
})

app.get('/blockchain', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(Cache.readJSON());
})

app.get('/transaction', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

// POST Requests
app.post('/blockchain', (req, res) => {
  let incomingBlockchain = req.body;
  let currentBlockchain = JSON.parse(Cache.readJSON());

  if (validateIncomingBlockchain(incomingBlockchain, currentBlockchain)) {
    if (current.chain.length < incomingBlockchain.chain.length) {
      Cache.write(JSON.stringify(incomingBlockchain, null, 4));
    }
  } else {
    res.send('Invalid blockchain.')
  }
})

app.post('/transaction', (req, res) => { // Validate Transaction
  const fromAddress = req.body.from;
  const toAddress = req.body.to;
  const amount = Number(req.body.amount);
  const validTransaction = blockchain.createTransaction(fromAddress, toAddress, amount);

  if (validTransaction) {
    res.send(`Pending transaction: ${fromAddress} to ${toAddress} for the amount of $${amount}`)
  } else {
    res.send(`Transaction declined: Insufficient funds.`)
  }
})





app.listen(process.env.PORT || 3000, () => {
  console.log("\n==================")
  console.log("Welcome to js-chain")
  console.log("==================\n")
  console.log('Example app listening on port 3000!')


  ///////// Ask for inputs
  // We can use this to optionally start mining
  // Or as for private/public keys
  // Or ask for a name to use
  // Ask for a default URL for diglet/peers

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


  // Check for public/private key stored locally

  // privkey.pem
  // pubkey.pub



  // IF no keys detected => prompt: would you like to generate a pair of keys?
    // IF no => exit
    // IF yes => continue




  rl.question('\n\nWould you like to begin mining? [y/n]\n\n\n', (answer) => {
    if (answer === 'y') {
      console.log('You chose to start mining...')
      blockchain.beginMining();
    } else {
      console.log("You chose not to mine\n\n")
    }
    rl.close();
  });

  /////////
})





