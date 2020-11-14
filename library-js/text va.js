// fonctions à rajouter au type String

// variables à modifier selon votre ordinateur
const sep = '/';
const pathRoot = '/home/lenovo' + sep;
const pathDesktop = pathRoot + 'Bureau' + sep;
const pathArticles = pathDesktop + 'articles' + sep;
const pathShortcut ={
	'r/': pathRoot,
	'b/': pathDesktop,
	'a/': pathArticles,
};
// fonctions basiques
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
// fonctions identifiant des fichiers
const extentionsImg =[ 'bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif' ];
const extentions =[ 'js', 'py', 'php', 'java', 'sql', 'css', 'txt', 'html', 'htm', 'xml', 'json', 'csv', 'tsv', 'mp3', 'mp4' ].concat (extentionsImg);

String.prototype.isFile = function(){
	// pour les fichiers locaux ou en ligne
	if (! this.contain ('.')) return null;
	var text = this.strip();
	var forbinddenChar ='\n\t\r';
	var isAfile = true;
	var c=0;
	while (isAfile && c< forbinddenChar.length){
		if (this.contain (forbinddenChar[c])) isAfile = false;
	c++; }
	if (! isAfile) return null;
	// identifier l'extention
	var textList = this.split ('.');
	var title = textList.pop();
	if (! title || title.contain ('/') || title.contain (sep)) return null;
	else if (! title.containList (extentions)) return null;
	title = textList.pop();
	if (! title) return null;
	// identifier le titre
	if (title.contain ('/')){
		var pos = title.rindex ('/') +1;
		title = title.slice (pos);
	}
	if (title.contain (sep)){
		var pos = title.rindex (sep) + sep.length;
		title = title.slice (pos);
	}
	return title;
}
String.prototype.isLink = function(){
	if (this.slice (0,4) != 'http') return null;
	else if (this.slice (0,7) != 'http://' && this.slice (0,8) != 'https://') return null;
	var title = this.slice (7);
	title = title.strip();
	if (title.contain ('/')){
		var pos = title.rindex ('/') +1;
		title = title.slice (pos);
	}
	if (title.contain ('.')){
		var pos = title.rindex ('.');
		title = title.slice (0, pos);
	}
	title = title.replace ('-', ' ');
	title = title.replace ('_', ' ');
	if (title.contain ('.')){
		var d=1+ title.rindex ('.');
		title = title.slice (d);
	}
	return "<a href='"+ this +"'>"+ title +'</a>';
}
String.prototype.isImg = function(){
	var text = this;
	var title = this.isFile();
	if (! title) return null;
	var ext = this.split ('.').pop();
	if (ext.containList (extentionsImg)) return "<img src='"+ text +"' alt=''>";
	else return null;
}
String.prototype.isLocalFile = function(){
	if (! this.isFile() || this.isLink()) return null;
	var start = this.slice (0,1);
	var text = this;
	for (var i in pathShortcut) if (i== start) text = text.replace (i, pathShortcut[i]);
	if (text.contain (pathRoot)) return text;
	else return null;
}
String.prototype.fromFile_assync = function (callback){
	// récupérer le texte d'un fichier. la string est le nom du fichier
	var fileName = this.isLocalFile();
	if (fileName){
		// mes fichiers sont petits, j'utilise les requêtes synchrones, simples à traiter
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			var fileText = '<p>fichier non trouvé</p><h2>'+ fileName +'</h2>';
			if (this.status == 200){
				fileText = xhttp.response;
				fileText = fileText.clean();
			}
			console.log (fileText);
			if (callback) callback (fileText);
		}
		xhttp.open ('GET', fileName);
		xhttp.send();
	}
}
String.prototype.fromFile = function(){
	// récupérer le texte d'un fichier. la string est le nom du fichier
	var fileName = this.isLocalFile();
	var fileText = 'fichier non trouvé: '+ fileName;
	if (fileName){
		// mes fichiers sont petits, j'utilise les requêtes synchrones, simples à traiter
		var xhttp = new XMLHttpRequest();
		xhttp.open ('GET', fileName, false);
		xhttp.send();
		if (xhttp.status ==200){
			fileText = xhttp.response;
			fileText = fileText.clean();
	}}
	return fileText;
}
String.prototype.show = function (node){
	// le texte est du html
	if (! node) node = document.body;
	node.innerHTML = this;
}