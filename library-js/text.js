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
String.prototype.count = function (word) {
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
}/*
String.prototype.slice = function (start, end){
	if (! end) end = this.length -1;
	else if (end <0) end = this.length +end;
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
	text = text.replace ('\t\n', '\n');
	while (text.contain ('\n\n')) text = text.replace ('\n\n', '\n');
	while (text.contain ('_______')) text = text.replace ('_______', '______');
	while (text.contain ('-------')) text = text.replace ('-------', '------');
	text = text.strip();
	return text;
}
String.prototype.toHtml = function(){
	var text = this.clean();
	// les balises classiques
	text = text.replace ('\n','</p><p>');
	text = '<p>'+ text +'</p>';
	text = text.replace ('<p>------ ','<h3>');
	text = text.replace (' ------</p>','</h3>');
	text = text.replace ('<p>______ ','<h2>');
	text = text.replace (' ______</p>','</h2>');
	text = text.replace ('<p>______</p><h2>','<h1>');
	text = text.replace ('<p>______</p>','<hr>');
	text = addTag (text, 'h2', 'h1');
	text = text.replace ('<p>\t','<li>');
	text = addTag (text, 'p', 'li');
	// les liens
	if (text.contain ('http')){
		var textList = text.split ('http');
		for (var l in textList){
			var f= textList[l].index (' ');
			var fb= textList[l].index ('<');
			if (f<0 && fb<0) console.log ('pas de fin', l);
			else if (f<0) f=fb;
			else if (fb>=0 && fb<f) f=fb;
			f-=1;
			var link = 'http'+ textList[l].slice (0,f);
			link = link.isLink();
			if (link) textList[l] = link + textList[l].slice (f+1);
			else textList[l] = 'http'+ textList[l];
		}
		text = textList.join ('');
		text = text.slice (4);
	}
	return text;
}
function addTag (text, oldTag, newTag){
	if (text.contain ('<'+ newTag +'>')){
		var textList = text.split ('<'+ newTag +'>');
		for (var l=1; l< textList.length; l++){
			var lineList = textList[l].split ('</'+ oldTag +'>');
			for (var m in lineList) if (lineList[m]) lineList[m] = lineList[m] +'</';
			lineList[0] = lineList[0] + newTag +'>'
			for (var m=1; m< lineList.length; m++) if (lineList[m]) lineList[m] = lineList[m] + oldTag +'>';
			textList[l] = lineList.join ('');
		}
		text = textList.join ('<'+ newTag +'>');
	}
	return text;
}