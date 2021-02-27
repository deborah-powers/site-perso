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

String.prototype.shortcut = function(){
	if (this.contain (pathRoot)) return this;
	var start = this.slice (0,2);
	for (var shortcut in pathShortcut) if (start == shortcut) start = this.replace (shortcut, pathShortcut[shortcut]);
	return start;
}