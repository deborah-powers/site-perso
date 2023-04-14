dateToSring (date){
	const year = date.getFullYear();
	const month = 1 + date.getMonth();
	const day = date.getDate();
	const hour = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	var dateStr = year + '-';
	if (month < 10) dateStr = dateStr + '0';
	dateStr = dateStr + month + '-';
	if (day < 10) dateStr = dateStr + '0';
	dateStr = dateStr + day + '-';
	if (hour < 10) dateStr = dateStr + '0';
	dateStr = dateStr + hour + '-';
	if (minutes < 10) dateStr = dateStr + '0';
	dateStr = dateStr + minutes + '-';
	if (seconds < 10) dateStr = dateStr + '0';
	dateStr = dateStr + seconds;
	return dateStr;
}