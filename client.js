const express = require('express');
const app = express();
const Cache = require('./scripts/cache');
const Blockchain = require('./scripts/blockchain');
const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
  res.send(':)');
})

app.get('/blockchain', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(Cache.readJSON());
})

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

app.post('/transactions', (req, res) => {
  let fromAddress = req.body.from;
  let toAddress = req.body.to;
  let amount = Number(req.body.amount);

  console.log(`Incoming transaction! from: ${fromAddress}, to: ${toAddress}, amount: ${amount}`);

  let validTransaction = blockchain.createTransaction(fromAddress, toAddress, amount);

  res.send(`${validTransaction ? 'Successful transaction' : 'Transaction failed'}`)
})

blockchain.beginMining();

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
