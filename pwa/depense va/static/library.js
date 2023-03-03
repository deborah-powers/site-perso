// fonctions à rajouter au type String

function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string' && (object.length ===0 || object ==="" || " \n\r\t".includes (object))) return false;
	else return true;
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
String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
String.prototype.strip = function(){
	var toStrip = ' /';
	var text = this;
	var i=0, j=1;
	while (toStrip.indexOf (text[0]) >=0) text = text.slice (1);
	while (toStrip.indexOf (text [text.length -1]) >=0) text = text.slice (0, text.length -1);
	return text;
}
String.prototype.clean = function(){
	var text = this.replace ('\r');
	var text = this.replace ('\n'," ");
	text = text.replace ('\t'," ");
	while (text.includes ('  ')) text = text.replace ('  ', ' ');
	text = text.strip();
	text = text.replace ('<br>', '<br/>');
	text = text.replace ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replace ('<br/><br/>', '<br/>');
	text = text.replace ('<br/><', '<');
	text = text.replace ('><br/>', '>');
	text = text.replace ('<span></span>');
	text = text.replace ('<p></p>');
	text = text.replace ('<div></div>');
	return text;
}