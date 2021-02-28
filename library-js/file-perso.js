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
String.prototype.shortcut = function(){
	if (this.contain (pathRoot)) return this;
	var start = this.slice (0,2);
	for (var shortcut in pathShortcut) if (start == shortcut) start = this.replace (shortcut, pathShortcut[shortcut]);
	return start;
}