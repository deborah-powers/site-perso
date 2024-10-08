/* fonctions à rajouter au type String
dépend de textFct.js
*/
function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string' && (object.length ===0 || object ==="" || " \n\r\t".includes (object))) return false;
	else return true;
}
String.prototype.fromModel = function (model){
	model = model.cleanTxt().replaceAll ('%%', '$');
	const modelPieces = model.split ('%');
	var text = this.cleanTxt();
	text = text.replace (modelPieces[0], "");
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
}}
String.prototype.containList = function (list){
	if (list.indexOf (this.toString()) >-1) return true;
	else return false;
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
		textTmp = this[l].join ('\t');
		text = text + textTmp +'\n';
	}
	return text;
}