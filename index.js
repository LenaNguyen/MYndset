const { analyseSentiment } = require('./services/azure');
const { determineMood } = require('./services/mindsetService');
const { mean, formatFirebaseData } = require('./utils/helper');
const { fetchMoods, addMood } = require('./firebase/moodActions');
var express = require('express');
var app = express();

app.use(express.json());

// const questions = [
// 	"How was your day?",
// 	"Are you tired?",
// 	"How have you been feeling lately?",
// 	"Do you think you have your priorities straight?"
// ]

// let today = new Date();
// let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// const moods = [
// 	{ date, score: 0.23, mood: 'upset', comment: 'I felt pretty sad.' },
// 	{ date, score: 0.83, mood: 'happy', comment: 'I felt pretty happy!' },
// 	{ date, score: 0.63, mood: 'neutral', comment: 'I felt pretty okay.' }
// ];

// moods.forEach(mood => {
// 	addMood(mood);
// })

const returnMoods = (moods, res) => {
	const formattedMoods = formatFirebaseData(moods);
	res.status(200).send(formattedMoods);
}

app.post('/api/detectMindset', async (req, res) => {
	const analysis = await analyseSentiment(req.body);
	const scores = await analysis.map(val => val.score);
	const meanScore = await mean(scores);
	const response = await determineMood(meanScore);
	res.status(200).send(response);
});

app.get('/api/moods', (req, res) => {
	const moods = fetchMoods(returnMoods, res);
});

app.listen(process.env.PORT || 3000);