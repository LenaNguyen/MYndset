const { moodRef } = require('./firebase');

const addMood = moodData => {
	moodRef.push(moodData);
}

const removeMood = moodData => {
	moodRef.child(moodData.key).remove();
}

const fetchMoods = (onFetch, res) => {
	moodRef.on('value', snapshot => {
		onFetch(snapshot.val(), res);
	})
}

module.exports = { addMood, removeMood, fetchMoods };
