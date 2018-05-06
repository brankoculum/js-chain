const Block = require('./block');
const Transaction = require('./transaction');
const SHA256 = require('crypto-js/sha256');


class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.difficulty = 2;

    // creates genesis block
    (() => {
      const gb = new Block('0', null, [
        new Transaction(null, 'Steven', 100),
        new Transaction(null, 'Branko', 100),
      ]);
      gb.hash = this.SHA('hello world');
      gb.nonce = 0;
      this.chain.push(gb);
    })();
  }

  SHA(str) {
    return SHA256(JSON.stringify(str)).toString();
  }

  mineBlock() {
    let newBlock = new Block(Date.now(), this.chain[this.chain.length - 1].hash, this.pendingTransactions);
    newBlock.nonce = 0;

    while (this.SHA(newBlock).slice(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      newBlock.nonce++;
    }

    newBlock.hash = this.SHA(newBlock);

    this.chain.push(newBlock);
    this.pendingTransactions = [];
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
        return false
      }
    }

    return true
  }

  createTransaction(fromAddress, toAddress, amount) {
    this.pendingTransactions.push(new Transaction(fromAddress, toAddress, amount))
  }

  getTransactionsForAddress(address) {
    let transactionsForAddress = [];
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.fromAddress === address || transaction.toAddress === address) {
          transactionsForAddress.push(transaction);
        }
      })
    })
    return transactionsForAddress;
  }

  getBalanceForAddress(address) {
    let balance = 0;
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        } else if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
      })
    })
    return balance;
  }

  validTransactionsForAddress(address) {
    let balance = 0;
    for (let transaction of this.getTransactionsForAddress(address)) {
      if (transaction.toAddress === address) {
        balance += transaction.amount;
      } else if (transaction.fromAddress === address) {
        balance -= transaction.amount;
        if (balance < 0) {
          return false;
        }
      }
    }
    return true;
  }

  toString() {
    console.log(JSON.stringify(this, null, 2));
  }
}

module.exports = Blockchain;




