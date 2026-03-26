const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('habitsgo');
const userCollection = db.collection('users');


// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to Database`);
  } catch (ex) {
    console.log(`Unable to connect to database because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(userName) {
  return userCollection.findOne({ "userName": userName });
}

function getUserByToken(token) {
  return userCollection.findOne({ "token": token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  result = await userCollection.updateOne({ "userName": user.userName }, { $set: user });
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne({ "userName": user.userName }, { $unset: { "token": 1 } });
}

async function updateUserHabits(user) {
  result = await userCollection.updateOne({ "userName": user.userName }, { $set: { "habits": user.habits } });
}

async function updateUserOverallStreak(user) {
  result = await userCollection.updateOne({ "userName": user.userName }, { $set: { "overallStreak": user.overallStreak } });
}

async function updateUserFriends(user) {
  result = await userCollection.updateOne({ "userName": user.userName }, { $set: { "friends": user.friends } });
}

module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
    updateUserRemoveAuth,
    updateUserHabits,
    updateUserOverallStreak,
    updateUserFriends
}