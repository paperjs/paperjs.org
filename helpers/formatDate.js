var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' ];

module.exports = {
	formatDate: function(date) {
		var month = date.getMonth(),
			day = date.getUTCDate(),
			year = date.getUTCFullYear();
		return day + '. ' + months[month] + ' ' + year;
	}
};