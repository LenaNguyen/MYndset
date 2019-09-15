mean = (vals) => {
	let sum = 0;
	for (let i = 0; i < vals.length; i++) {
		sum += parseFloat(vals[i]);
	}
	return sum / vals.length;
};

formatFirebaseData = (resp) => {
	const data = Object.keys(resp).map(key => { resp[key]['key'] = key; return resp[key] });
	return data;
}
module.exports = { mean, formatFirebaseData };