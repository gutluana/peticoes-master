const { MongoClient } = require('mongodb');

require('dotenv').config();

console.log("conexao ->"+process.env.mongoUri);

const client = new MongoClient("mongodb+srv://root:luana123@cluster0.lcgbwwd.mongodb.net/?retryWrites=true&w=majority");

module.exports = client;
