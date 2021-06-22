// fonctions à rajouter au type String

String.prototype.copy = function(){
	var text ="";
	for (var l=0; l< this.length; l++) text = text + this[l];
	return text;
}
String.prototype.index = function (word, pos){
	if (! pos) pos =0;
	return this.indexOf (word, pos);
}
String.prototype.rindex = function (word){
	return this.lastIndexOf (word);
}
String.prototype.contain = function (word){
	if (this.index (word) >=0) return true;
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
	if (! wordNew) wordNew ="";
	var tabText = this.split (wordOld);
	return tabText.join (wordNew);
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
String.prototype.sliceWords = function (wordD, wordF){
	var d= this.index (wordD);
	var f= this.index (wordF, d) + wordF.length;
	return this.slice (d,f);
}
String.prototype.strip = function(){
	var toStrip = '\n \t/';
	var text = this.copy();
	var i=0, j=1;
	while (toStrip.contain (text[0])) text = text.slice (1);
	while (toStrip.contain (text [text.length -1])) text = text.slice (0, text.length -1);
	return text;
}
String.prototype.clean = function(){
	var text = this.replace ('\r');
	text = text.strip();
	while (text.contain ('  ')) text = text.replace ('  ', ' ');
	text = text.replace ('\n ', '\n');
	text = text.replace (' \n', '\n');
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
String.prototype.toHtml = function(){
	var text = this.clean();
	text = '<p>'+ text +'</p>';
	var toReplace =[ ['\n', '</p><p>'], ['<p>====== ', '<h1>'], [' ======</p>', '</h1>'], ['<p>****** ', '<h2>'], [' ******</p>', '</h2>'], ['<p>------ ', '<h3>'], [' ------</p>', '</h3>' ],
		['<p>http', "<p><a href='http"], ['<p>\t', '<li>']];
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