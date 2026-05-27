function(properties, context) {
	const DatetimeRound = require('datetime-round');
	const moment = require('moment');

	let d = DatetimeRound(moment(properties.date_to_round), properties.round_to_x, properties.round_for, properties.round_to).toISOString();
	return {rounded_date: d}
}