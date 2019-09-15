const { mood, bound } = require('../utils/constants');

determineMood = (score) => {
	const { upper, lower } = bound;
	let obj = { score };

	if (score >= upper)
		obj['mood'] = mood.POSITIVE;
	else if (score < upper && score > lower)
		obj['mood'] = mood.NEUTRAL;
	else if (score <= lower)
		obj['mood'] = mood.NEGATIVE;

	return obj;
}

module.exports = { determineMood };