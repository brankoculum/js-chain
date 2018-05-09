# js-chain
A JavaScript implementation of a block chain cryptocurrency using proof of work.

Created by Steven Shen and Branko Culum

# Todos:
## Short term

- `Cache.readJSON` is redundant, but read must return a parsed object, code might break elsewhere
- **Migrate to Diglet instead of ngrok (Thursday)**
  - https://github.com/bookchin/diglet
- Add timestamps to transactions and hash transactionID
  - Also add timestamps to wallet#show in exchange
- Style exchange using bootstrap
- Implement rewards for miners
- Optimize blockchain.json size => Maybe don't mind blocks without transactions?
- Each node should track IPs of peers
  - Periodically send out pings to test for connection
  - Delect record of IP if failed ping request
- Put addresses in local .json and iterate over them to send posts after mining a block
- Broadcast transactions using "Signaling Server"
  - minimum transactions to begin mining


## Long term
- Make CLI + GUI for client.js
  - Enter your pk/sk for rewards
  - Enter if you want to enable mining
  - Have GUI for mining process and track incoming/outgoing requests
- Make front end to interact with blockchain
