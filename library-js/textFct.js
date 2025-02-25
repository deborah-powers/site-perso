/* nettoyer du texte, afin de le préparer à la transformation en html.
fonctionne avec htmlFct.js
basé sur python/textFct.py
*/
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZaàâbcdeéêèëfghiîïjkmlmnoôpqrstuûvwxyz0123456789-\xe7\xc7';
const punctuation = '.?:\n\t!;,';
const brackets = '({[]})"\' ';
const weirdChars =[
	['« ', '"'], [' »', '"'], ['«', '"'], ['»', '"'], ['–', '-'], ['‘', "'"], ['’', "'"], ['“', '"'], ['”', '"'], ['"', '"'], ['&hellip;', '...'], ['&#8230;', '...'], ['…', '...'],
	['\n ', '\n'], ['\r', ''], [' \n', '\n'], ["\\'", "'"], ['\\n', '\n'], ['\\r', ''], ['\\t', '\t'],
	['\\u00c2', 'Â'], ['\\u00ca', 'Ê'], ['\\u00cb', 'Ë'], ['\\u00ce', 'Î'], ['\\u00cf', 'Ï'], ['\\u00d4', 'Ô'], ['\\u00d6', 'Ö'], ['\\u00db', 'Û'], ['\\u00e0', 'à'], ['\\u00e2', 'â'], ['\\u00e7', 'ç'], ['\\u00e8', 'è'], ['\\u00e9', 'é'], ['\\u00ea', 'ê'], ['\\u00eb', 'ë'], ['\\u00ee', 'î'], ['\\u00ef', 'ï'], ['\\u00f4', 'ô'], ['\\u00f6', 'ö'], ['\\u00fb', 'û'],
	['\\', '/'],
	['\x85', '.'], ['\x92', "'"], ['\x96', '"'], ['\x97', "'"], ['\x9c', ' '], ['\xa0', ' '],
	['&agrave;', 'à'], ['&acirc;', 'â'], ['&ccedil;', 'ç'], ['&eacute;', 'é'], ['&egrave;', 'è'], ['&ecirc;', 'ê'], ['&icirc;', 'î'], ['&iuml;', 'ï'], ['&ocirc;', 'ô'], ['&ugrave;', 'ù'], ['&ucirc;', 'û'], ['&apos;', "'"],
	['&mdash;', ' '], ['&nbsp;', ''], ['&oelig;', 'oe'], ['&quot;', ''], ['&lt;', '<'], ['&gt;', '>'], ['&lsquo;', '"'], ['&ldquo;', '"'], ['&rdquo;', '"'], ['&rsquo;', "'"], ['&laquo;', '"'], ['&raquo;', '"'], ['&#8220;', '"'], ['&#8221;', '"'], ['&#8211;', '-'],
	['&amp;', '&'], ['&#x27;', "'"], ['&#039', "'"], ['&#160;', ' '], ['&#39;', "'"], ['&#8217;', "'"], ['\n" ', '\n"']
];
const urlWords =[
	[': /', ':/'], [': \\', ':\\'], ['localhost: ', 'localhost:'], ['www. ', 'www.'], ['. bmp', '.bmp'], ['. gif', '.gif'], ['. jpeg', '.jpeg'], ['. jpg', '.jpg'], ['. png', '.png'], ['. css', '.css'], ['. js', '.js'], [': 80', ':80'], ['. com', '.com'], ['. org', '.org'], ['. net', '.net'], ['. fr', '.fr'], ['. ico', '.ico']
];
const imgExtension =[ 'jpg', 'jpeg', 'bmp', 'gif', 'png'];
const points =[ '\n', '. ', '! ', '? ', ': ', ':\t', '\n_ ', '\n* ', '\n- ', '\n\t', '### ', '___ ', '--- ', '*** ', '=== '];
const uppercaseLetters =[
	'aA', 'àA', 'bB', 'cC', '\xe7\xc7', 'dD', 'eE', 'éE', 'èE', 'êE', 'ëE', 'fF', 'gG', 'hH', 'iI', 'îI', 'ïI', 'jJ', 'kK', 'lL', 'mM', 'nN', 'oO', '\xf4\xe4', 'pP', 'qQ', 'rR', 'sS', 'tT', 'uU', 'vV', 'wW', 'xX', 'yY', 'zZ'
];
const wordsBeginMaj =[
	'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', 'deborah', 'powers', 'maman', 'mamie', 'papa', 'papi', 'victo', 'tony', 'robert', 'simplon', 'loïc', 'jared', 'leto', 'ville valo', 'valo', 'shelby', 'magritte', 'france', 'paris', 'rueil', 'malmaison', 'avon', 'fontainebleau', 'ivry', 'chateaudun', 'châteaudun', 'c:'
];
const wordsBeginMin =[ 'Deborah.powers', 'Deborah.noisetier', 'Http', 'File:///', '\nPg_' ];
const codeKeywords =[
	'set schema', 'declare', 'begin', 'do $$', 'update', 'select', 'from', 'inner join', 'outer join', 'left outer join', 'where',
	'having', 'group by', 'order by', 'insert into', 'if', 'elseif', 'end', 'loop', 'perform', 'drop ',
	'cd', 'psql', 'git', 'return', 'mvn', 'python', 'else',
	'def', 'class', 'console.log', 'var', 'const ', 'function ', 'private ', 'protected', 'public',
	'log.debug', 'log.info'
];
function exists (object){
	if (object === null || object === undefined) return false;
	else if (typeof (object) == 'string') return object.isEmpty();
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else return true;
}
String.prototype.isEmpty = function(){
	if (this ==="") return true;
	var text = this.replaceAll ('\n', "");
	text = text.replaceAll ('\t', "");
	text = text.replaceAll (" ", "");
	if (text ==="") return true;
	else return false;
}
String.prototype.usePlaceholders = function(){
	const placeholders = ('y/n', 'e/c', 'h/c', 'f/n', 'l/n');
	var text = this.cleanTxt();
	for (var p=0; p< placeholders.length; p++){
		text = text.replaceAll (placeholders[p].toUpperCase(), placeholders[p]);
		text = text.replaceAll ('('+ placeholders[p] +')', placeholders[p]);
		text = text.replaceAll ('['+ placeholders[p] +']', placeholders[p]);
		text = text.replaceAll ('{'+ placeholders[p] +'}', placeholders[p]);
	}
	text = text.replaceAll ('y/n', 'Deborah');
	text = text.replaceAll ('f/n', 'Deborah');
	text = text.replaceAll ('e/c', 'grey');
	text = text.replaceAll ('h/c', 'dark blond');
	text = text.replaceAll ('l/n', 'Powers');
	return text;
}

/* ======================== nettoyage du texte ======================== */

String.prototype.cleanTxt = function(){
	var text = this.cleanBasic();
	// la ponctuation
	for (var p=0; p< punctuation.length; p++) text = text.replaceAll (' '+ punctuation[p], punctuation[p]);
	const chars3 = '=*-_~.';
	for (char of chars3){ while (text.includes (char + char + char + char)) text = text.replaceAll (char + char + char + char, char + char + char); }
	for (var l=0; l< letters.length; l++){
		text = text.replaceAll (letters[l] +'!', letters[l] +' !');
		text = text.replaceAll (letters[l] +'?', letters[l] +' ?');
		text = text.replaceAll ('...' + letters[l], '... '+ letters[l]);
	}
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	// restaurer les url
	if (text.includes ('http') && text.includes ('?')){
		var textList = text.split (' ?');
		for (var t=0; t< textList.length -1; t++){
			if (textList[t].includes ('http')){
				var d= textList[t].lastIndexOf ('http');
				const textTmp = textList[t].substring (d);
				if (textTmp.includes (" ") || textTmp.includes ('\t') || textTmp.includes ('\n')) textList[t] = textList[t] +" ";
			}
			else textList[t] = textList[t] +" ";
		}
		text = textList.join ('?');
	}
	// restaurer les heures
	var textList = text.split (':');
	for (var t=0; t< textList.length -1; t++){
		if (textList[t].length >1 && textList[t+1].length >1
			&& '012345'.includes (textList[t][-2]) && '0123456789'.includes (textList[t][-1])
			&& '012345'.includes (textList[t+1][0]) && '0123456789'.includes (textList[t+1][1]))
			continue;
		else textList[t+1] =" "+ textList[t+1]
	}
	text = textList.join (':');
	// nettoyer
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	for (var w=0; w<8; w++) text = text.replaceAll (urlWords[w][0], urlWords[w][1]);
	for (var w=8; w< urlWords.length; w++){
		for (var e=0; e< brackets.length; e++) text = text.replaceAll (urlWords[w][0] + brackets[e], urlWords[w][1] + brackets[e]);
		for (var e=3; e< punctuation.length; e++) text = text.replaceAll (urlWords[w][0] + punctuation[e], urlWords[w][1] + punctuation[e]);
	}
	text = text.replaceAll (' \n', '\n');
	text = text.replaceAll (' \t', '\t');
	text = text.replaceAll ('\t ', '\t');
	text = text.replaceAll ('\n ', '\n');
	// mise en forme
	const chars = '*#=~-_';
	for (var char of chars) while (text.includes (char + char + char + char)){
		text = text.replace (char + char + char + char, char + char + char);
	}
	text = text.capitalize();
	return text;
}
String.prototype.cleanBasic = function(){
	var text = this.strip();
	for (var c=0; c< weirdChars.length; c++) text = text.replaceAll (weirdChars[c][0], weirdChars[c][1]);
	text = text.strip();
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	text = text.replaceAll ('\n ', '\n');
	text = text.replaceAll (' \n', '\n');
	text = text.replaceAll ('\t ', '\t');
	text = text.replaceAll (' \t', '\t');
	// while (text.includes ('\t\t')) text = text.replaceAll ('\t\t', '\t');
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	text = text.replaceAll ('\t\n', '\n');
	while (text.includes ('\n\n')) text = text.replaceAll ('\n\n', '\n');
	return text;
}
String.prototype.cleanTitle = function(){
	var title = this.toLowerCase();
	title = title.replaceAll ('\n', " ");
	title = title.replaceAll ('\t', " ");
	while (title.includes ("  ")) title = title.replaceAll ("  "," ");
	title = title.strip();
	return title;
}
String.prototype.capitalize = function(){
	var text ='\n'+ this+'\n';
	for (var l=0; l< uppercaseLetters.length; l++)
		for (var p=0; p< points.length; p++){ text = text.replace (points[p] + uppercaseLetters[l][0], points[p] + uppercaseLetters[l][1]); }
	for (var w=0; w< wordsBeginMaj.length; w++){
		for (var p=0; p< points.length; p++) text = text.replaceAll (points[p] + wordsBeginMaj[w], points[p] + wordsBeginMaj[w].capitalizeOneWord());
		for (var p=0; p< punctuation.length -2; p++) text = text.replaceAll (punctuation[p] + wordsBeginMaj[w], punctuation[p] + wordsBeginMaj[w].capitalizeOneWord());
	}
	for (var word of wordsBeginMin) text = text.replace (word, word.toLowerCase());
	// le code
	for (artefact of codeKeywords){
		text = text.replace ('\n'+ artefact.capitalizeOneWord() +' ', '\n'+ artefact +' ');
		text = text.replace ('\t'+ artefact.capitalizeOneWord() +' ', '\t'+ artefact +' ');
		text = text.replace ('\n'+ artefact.capitalizeOneWord() +'\n', '\n'+ artefact +'\n');
		text = text.replace ('\t'+ artefact.capitalizeOneWord() +'\n', '\t'+ artefact +'\n');
	}
	text = text.strip();
	return text;
}
String.prototype.capitalizeOneWord = function(){ return this[0].toUpperCase() + this.substring (1); }
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
String.prototype.strip = function (char){
	var toStrip = '\n \t/';
	if (char !== undefined) toStrip = toStrip + char;
	var d=0;
	while (d< this.length && toStrip.includes (this[d])) d++;
	var f= this.length -1;
	while (f>=0 && toStrip.includes (this[f])) f--;
	f=f+1;
	return this.slice (d,f);
}
String.prototype.count = function (char){
	if (! this.includes (char)) return 0;
	else{
		var nbOccurences =0;
		var pos =0;
		while (this.substring (pos).includes (char)){
			pos =1+ this.indexOf (char, pos);
			nbOccurences +=1;
		}
		return nbOccurences;
	}
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
