// fonctions à rajouter au type String

function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string' && (object.length ===0 || object ==="" || " \n\r\t".includes (object))) return false;
	else return true;
}
String.prototype.fromModel = function (model){
	model = model.clean().replaceAll ('%%', '$');
	var text = this.clean();
	const modelPieces = model.split ('%');
	var text = text.replace (modelPieces[0], "");
	var d=0;
	var value;
	var data =[];
	for (var p=1; p< modelPieces.length; p++){
		if (modelPieces[p].length <2) value = text;
		else{
			d= text.indexOf (modelPieces[p].substring (1));
			value = text.substring (0,d);
		}
		if (modelPieces[p][1] === 's') data.push (value);
		else if (modelPieces[p][1] === 'd') data.push (parseInt (value));
		else if (modelPieces[p][1] === 'f') data.push (parseFloat (value));
		else data.push (value);
		text = text.substring (d-1+ modelPieces[p].length);
	}
	return data;
}
String.prototype.toModel = function (data){
	text = this.replaceAll ('%s', '%$');
	text = text.replaceAll ('%d', '%$');
	text = text.replaceAll ('%f', '%$');
	for (var d=0; d< data.length; d++) text = text.replace ('%$', data[d]);
	return text;
}
String.prototype.copy = function(){
	var text ="";
	for (var l=0; l< this.length; l++) text = text + this[l];
	return text;
}
String.prototype.index = function (word, pos){
	if (pos == null || pos == undefined) pos =0;
	var posReal = this.indexOf (word, pos);
	if (posReal <0 && word.includes ('"')){
		word = word.replaceAll ('"', "'");
		posReal = this.indexOf (word, pos);
	}
	else if (posReal <0 && word.includes ("'")){
		word = word.replaceAll ("'", '"');
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
	if (! this.includes (word)) return 0;
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
replace --> replaceAll
contain --> includes
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
	if (wordD && wordD != undefined) d= this.indexOf (wordD) + wordD.length;
	if (wordF && wordF != undefined){
		var f= this.indexOf (wordF, d);
		return this.slice (d,f);
	}
	else return this.slice (d);
}
String.prototype.strip = function(){
	var toStrip = '\n \t\\/';
	var text = this;
	var i=0, j=1;
	while (toStrip.includes (text[0])) text = text.slice (1);
	while (toStrip.includes (text [text.length -1])) text = text.slice (0, text.length -1);
	return text;
}
String.prototype.clean = function(){
	var text = this.replaceAll ('\r', "");
	text = text.strip();
	while (text.includes ('  ')) text = text.replaceAll ('  ', ' ');
	text = text.replaceAll ('\n ', '\n');
	text = text.replaceAll (' \n', '\n');
	text = text.replaceAll ('\t ', '\t');
	text = text.replaceAll (' \t', '\t');
	while (text.includes ('\t\t')) text = text.replaceAll ('\t\t', '\t');
	text = text.replaceAll ('\t\n', '\n');
	while (text.includes ('\n\n')) text = text.replaceAll ('\n\n', '\n');
	while (text.includes ('_______')) text = text.replaceAll ('_______', '______');
	while (text.includes ('-------')) text = text.replaceAll ('-------', '------');
	while (text.includes ('=======')) text = text.replaceAll ('=======', '======');
	while (text.includes ('*******')) text = text.replaceAll ('*******', '******');
	text = text.strip();
	return text;
}
String.prototype.cleanHtml = function(){
	var text = this.replace ('\n'," ");
	text = text.replaceAll ('\t'," ");
	text = text.clean();
	text = text.replaceAll ('<br>', '<br/>');
	text = text.replaceAll ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replaceAll ('<br/><br/>', '<br/>');
	text = text.replaceAll ('<br/><', '<');
	text = text.replaceAll ('><br/>', '>');
	text = text.replaceAll ('<span></span>', "");
	text = text.replaceAll ('<p></p>', "");
	text = text.replaceAll ('<div></div>', "");
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
		['<p>http', "<p><a href='http"], ['<p>\t', '<li>'], ['<p>======</p>', '<hr/>'], ['<p>******</p>', '<hr/>']];
	for (var r=0; r< toReplace.length; r++) text = text.replaceAll (toReplace[r][0], toReplace[r][1]);
	// les liens
	var linkList = text.split ('<a href=');
	for (var r=1; r< linkList.length; r++){
		var d= linkList[r].index ('</');
		var linkFull = linkList[r].substring (0,d);
		linkList[r] = linkList[r].substring (d);
		if (linkFull.substring (linkFull.length -1) =='/') linkFull = linkFull.substring (0, linkFull.length -1);
		d= linkFull.rindex ('/') +1;
		var linkTitle = linkFull.substring (d);
		if (linkTitle.includes ('.')){
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