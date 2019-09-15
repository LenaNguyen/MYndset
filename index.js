const { analyseSentiment } = require('./services/azure');
const { determineMood } = require('./services/mindsetService');
const { mean, formatFirebaseData } = require('./utils/helper');
const { fetchMoods, addMood } = require('./firebase/moodActions');
var express = require('express');
var cors = require('cors');
var app = express();

app.use([express.json(), cors(), express.urlencoded({ extended: true })]);

const questions = [
	"How was your day?",
	"How have you been feeling lately?",
	"Are you looking forward to tomorrow?"
]

let today = new Date();
let date = today.getDate();
// let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

const returnMoods = (moods, res) => {
	const formattedMoods = formatFirebaseData(moods);
	res.status(200).send(formattedMoods);
}

app.post('/api/detectMindset', async (req, res) => {
	try {
		const language = 'en';
		let input = req.body;
		let qnas = [];

		//fix voiceflow formatting	
		if (typeof req.body === 'object') {
			let answerObjs = Object.keys(input)[0].split(",");
			texts = answerObjs.map(i => {
				keyVal = i.split(':');
				return keyVal[1];
			})
			input = [];
			for (let i = 0; i < answerObjs.length; i++) {
				let obj = { text: texts[i], language, id: i.toString() }
				input.push(obj);
			}
		}

		for (let i = 0; i < input.length; i++) {
			qnas.push({ question: questions[i], answer: input[i].text, key: i });
		}

		const analysis = await analyseSentiment(input);
		const scores = await analysis.map(val => val.score);
		const meanScore = await mean(scores);
		let response = await determineMood(meanScore);

		response['qnas'] = qnas;
		response['date'] = date;
		addMood(response);
		res.status(200).send(response);
	} catch (e) {
		console.log(e)
		res.status(500).send({ message: 'oops!' });
	}
});

app.get('/api/moods', (req, res) => {
	const moods = fetchMoods(returnMoods, res);
});

app.post('/api/test', (req, res) => {
	res.status(200).send(req.body);
})

app.use((err, req, res, next) => {
	res.status(500).json({
		message: err.message,
		error: err
	});
})

app.listen(process.env.PORT || 3000);