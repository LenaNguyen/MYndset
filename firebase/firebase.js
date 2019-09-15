const Firebase = require('firebase');
const { firebaseConfig } = require('./config');

Firebase.initializeApp(firebaseConfig);
const databaseRef = Firebase.database().ref();
const moodRef = databaseRef.child('moods');

module.exports = { moodRef };