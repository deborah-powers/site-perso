function itemFromUrl (url){
	var paramsStr ="";
	if (exists (url)){
		var d= url.indexOf ('?') +1;
		paramsStr = url.slice (d);
	}
	else paramsStr = window.location.search.slice (1);
	paramsStr = paramsStr.replace ('&', '=');
	const paramsList = paramsStr.split ('=');
	var params ={};
	for (var p=0; p< paramsList.length; p=p+2) params [paramsList[p]] = paramsList[p+1];
	return params;
}
Date.prototype.toStringPerso = function(){
	const year = this.getFullYear();
	const month =1+ this.getMonth();
	const day = this.getDate();
	var dateStr = year +'-';
	if (month <10) dateStr = dateStr +'0';
	dateStr = dateStr + month +'-';
	if (day <10) dateStr = dateStr +'0';
	dateStr = dateStr + day;
	return dateStr;
}
String.prototype.strip = function(){
	var toStrip = ' /';
	var text = this;
	var i=0, j=1;
	while (toStrip.indexOf (text[0]) >=0) text = text.slice (1);
	while (toStrip.indexOf (text [text.length -1]) >=0) text = text.slice (0, text.length -1);
	return text;
}