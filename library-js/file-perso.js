/* nécessaire pour file.js
dépend de text.js
*/
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
const extentionsImg =[ 'bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif' ];
const extentions =[ 'js', 'py', 'php', 'java', 'sql', 'css', 'txt', 'html', 'htm', 'xml', 'json', 'csv', 'tsv', 'mp3', 'mp4' ]
	.concat (extentionsImg);

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