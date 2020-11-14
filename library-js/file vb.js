// dépend de text.js et de file-perso.js

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
			// fileText = fileText.clean();
	}}
	return fileText;
}
String.prototype.show = function (node){
	// le texte est du html
	if (! node) node = document.body;
	node.innerHTML = this;
}