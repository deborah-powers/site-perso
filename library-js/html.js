/* remplacer markdown en utilisant ma mise en forme personelle.
j'affiche des fichiers .txt dans des pages web.
dépendence: text.js
utilisation:
	var fileName = '/path/to/my/fileName.txt';
	fileName.getFile();
*/
String.prototype.getFile = function(){
	// la string est un fichier
	var text = this.fromFile();
	text.showTxt();
}
String.prototype.showTxt = function (node){
	// le texte est du txt
	text = this.toHtml();
	text.show (node);
}
String.prototype.toHtml = function(){
	var text = this.clean();
	// les balises classiques
	text = text.replace ('\n','</p><p>');
	text = '<p>'+ text
	text = text.replace ('<p>------ ','<h3>');
	text = text.replace (' ------</p>','</h3>');
	text = text.replace ('<p>______ ','<h2>');
	text = text.replace (' ______</p>','</h2>');
	text = text.replace ('<p>______</p><h2>','<h1>');
	text = text.replace ('<p>______</p>','<hr>');
	addTag (text, 'h2', 'h1');
	text = text.replace ('<p>\t','<li>');
	addTag (text, 'p', 'li');
	// les liens
	if (text.contain ('http')){
		var ficList = text.split ('http');
		for (var l in ficList){
			var f= ficList[l].index (' ');
			var fb= ficList[l].index ('<');
			if (f<0 && fb<0) console.log ('pas de fin', l);
			else if (f<0) f=fb;
			else if (fb>=0 && fb<f) f=fb;
			f-=1;
			var link = 'http'+ ficList[l].slice (0,f);
			link = link.isLink();
			if (link) ficList[l] = link + ficList[l].slice (f+1);
			else ficList[l] = 'http'+ ficList[l];
		}
		text = ficList.join ('');
		text = text.slice (4);
	}
	return text;
}
function addTag (text, oldTag, newTag){
	if (text.contain ('<'+ newTag +'>')){
		var ficList = text.split ('</'+ oldTag +'>');
		for (var l in ficList){
			if (ficList[l].contain (newTag)) ficList[l] = ficList[l] +'</'+ newTag +'>';
			else ficList[l] = ficList[l] +'</'+ oldTag +'>';
		}
		text = ficList.join ('');
	}
	return text;
}
