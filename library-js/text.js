// fonctions à rajouter au type String

function exists (object){
	if (object == null || object == undefined) return false;
	else if ((object.constructor == Array || object.constructor == HTMLCollection) && object.length ==0) return false;
	else if (typeof (object) == 'string'){
		if (object.length ==0 || object =="" || object ==" " || object =="\n" || object =="\t" || object =="\r") return false;
		else return true;
	}
	else return true;
}
String.prototype.copy = function(){
	var text ="";
	for (var l=0; l< this.length; l++) text = text + this[l];
	return text;
}
String.prototype.index = function (word, pos){
	if (pos == null || pos == undefined) pos =0;
	var posReal = this.indexOf (word, pos);
	if (posReal <0 && word.contain ('"')){
		word = word.replace ('"', "'");
		posReal = this.indexOf (word, pos);
	}
	else if (posReal <0 && word.contain ("'")){
		word = word.replace ("'", '"');
		posReal = this.indexOf (word, pos);
	}
	return posReal;
}
String.prototype.rindex = function (word, pos){
	if (pos == null || pos == undefined || pos <2) return this.lastIndexOf (word);
	else{
		var textTmp = this.slice (0, pos);
		return textTmp.lastIndexOf (word);
	}
}
String.prototype.contain = function (word){
	if (this.indexOf (word) >=0) return true;
	else return false;
}
String.prototype.containList = function (list){
	if (list.indexOf (this.toString()) >-1) return true;
	else return false;
}
String.prototype.count = function (word){
	if (! this.contain (word)) return 0;
	var pos =0, nb=0;
	while (pos >=0){
		pos = this.index (word, pos);
		if (pos <0) break;
		pos +=1; nb +=1;
	}
	return nb;
}
String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
/*
String.prototype.slice = function (start, end){
	if (! end) end = this.length -1;
	else if (end <0) end = this.length +end;
	if (start <0) start = this.length + start;
	var text ="";
	while (start <= end){
		text = text + this[start];
		start = start +1;
	}
	return text;
}*/
String.prototype.insert = function (word, pos){
	var text = this.slice (0, pos) + word + this.slice (pos);
	return text;
}
String.prototype.pop = function (posD, posF){
	// supprimer le bout de texte entre posD et posF
	var text = this.slice (0, posD) + this.slice (posF);
	return text;
}
String.prototype.sliceWords = function (wordD, wordF){
	var d=0;
	if (wordD && wordD != undefined) d= this.index (wordD) + wordD.length;
	if (wordF && wordF != undefined){
		var f= this.index (wordF, d);
		return this.slice (d,f);
	}
	else return this.slice (d);
}
String.prototype.sliceWords_va = function (wordD, wordF){
	var d= this.index (wordD);
	var f= this.index (wordF, d) + wordF.length;
	return this.slice (d,f);
}
String.prototype.strip = function(){
	var toStrip = '\n \t/';
	var text = this;
	var i=0, j=1;
	while (toStrip.index (text[0]) >=0) text = text.slice (1);
	while (toStrip.index (text [text.length -1]) >=0) text = text.slice (0, text.length -1);
	return text;
}
String.prototype.clean = function(){
	var text = this.replace ('\r');
	text = text.strip();
	while (text.contain ('  ')) text = text.replace ('  ', ' ');
	text = text.replace ('\n ', '\n');
	text = text.replace (' \n', '\n');
	text = text.replace ('\t ', '\t');
	text = text.replace (' \t', '\t');
	while (text.contain ('\t\t')) text = text.replace ('\t\t', '\t');
	text = text.replace ('\t\n', '\n');
	while (text.contain ('\n\n')) text = text.replace ('\n\n', '\n');
	while (text.contain ('_______')) text = text.replace ('_______', '______');
	while (text.contain ('-------')) text = text.replace ('-------', '------');
	while (text.contain ('=======')) text = text.replace ('=======', '======');
	while (text.contain ('*******')) text = text.replace ('*******', '******');
	text = text.strip();
	return text;
}
String.prototype.cleanHtml = function(){
	var text = this.replace ('\n');
	text = text.replace ('\t');
	text = text.clean();
	text = text.replace ('<br>', '<br/>');
	text = text.replace ('<hr>', '<hr/>');
	while (text.contain ('<br/><br/>')) text = text.replace ('<br/><br/>', '<br/>');
	text = text.replace ('<br/><', '<');
	text = text.replace ('><br/>', '>');
	text = text.replace ('<span></span>');
	text = text.replace ('<p></p>');
	text = text.replace ('<div></div>');
	return text;
}
String.prototype.fromTsv = function(){
	var text = this.strip();
	var textList = text.split ('\n');
	for (var l=0; l< textList.length; l++) textList[l] = textList[l].split ('\t');
	return textList;
}
Array.prototype.toTsv = function(){
	var text ="";
	var textTmp ="";
	for (var l=0; l< this.length; l++){
		textTmp ="";
		for (var c=0; c< this.length; c++) textTmp ='\t'+ textTmp;
		textTmp = textTmp.slice (1);
		text = text + textTmp +'\n';
	}
	return text;
}
String.prototype.toHtml = function(){
	var text = this.clean();
	text = '<p>'+ text +'</p>';
	var toReplace =[ ['\n', '</p><p>'], ['<p>====== ', '<h1>'], [' ======</p>', '</h1>'], ['<p>****** ', '<h2>'], [' ******</p>', '</h2>'], ['<p>------ ', '<h3>'], [' ------</p>', '</h3>' ],
		['<p>http', "<p><a href='http"], ['<p>\t', '<li>'], ['<p>======</p>', '<hr>'], ['<p>******</p>', '<hr>']];
	for (var r=0; r< toReplace.length; r++) text = text.replace (toReplace[r][0], toReplace[r][1]);
	// les liens
	var linkList = text.split ('<a href=');
	for (var r=1; r< linkList.length; r++){
		var d= linkList[r].index ('</');
		var linkFull = linkList[r].substring (0,d);
		linkList[r] = linkList[r].substring (d);
		if (linkFull.substring (linkFull.length -1) =='/') linkFull = linkFull.substring (0, linkFull.length -1);
		d= linkFull.rindex ('/') +1;
		var linkTitle = linkFull.substring (d);
		if (linkTitle.contain ('.')){
			d= linkTitle.rindex ('.');
			linkTitle = linkTitle.substring (0, d);
		}
		linkList[r] = linkFull +"'>"+ linkTitle +'</a>'+ linkList[r];
	}
	text = linkList.join ('<a href=');
	// les listes
	linkList = text.split ('<li>');
	for (var r=1; r< linkList.length; r++){
		var d= linkList[r].index ('</');
		var item = linkList[r].substring (0,d);
		d= linkList[r].index ('>',d) +1;
		linkList[r] = item +'</li>'+ linkList[r].substring (d);
	}
	text = linkList.join ('<li>');
	return text;
}
HTMLElement.prototype.fromText = function (text){
	text = text.toHtml();
	this.innerHTML = text;
}