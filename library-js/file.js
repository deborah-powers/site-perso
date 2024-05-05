/* fonctions pour ouvrir des fichiers
dépendence: text.js et text-clean.js
j'aurai souvent besoin d'utiliser un serveur afin d'ouvrir des fichiers
cd dossier/contenant/mon.fichier
python -m http.server
fileName = 'http://localhost:8000/mon.fichier';
*/
const extentionsImg =[ 'bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif' ];
const extentions =[ 'js', 'py', 'php', 'java', 'sql', 'css', 'txt', 'html', 'htm', 'xml', 'json', 'csv', 'tsv', 'mp3', 'mp4' ]
	.concat (extentionsImg);

// variables à modifier selon votre ordinateur
const sep = '/';
const pathRoot = '/home/deborah' + sep;
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
function fromFile (fileName, callback){
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){ if (this.readyState ==4) callback (this.responseText); };
		xhttp.open ('GET', fileName, true);
		xhttp.send();
		return null;
	}
	else{
		// méthode synchrone
		xhttp.open ('GET', fileName, false);
		xhttp.send();
		var textRes = null;
		if (xhttp.status ==0 || xhttp.status ==200) textRes = xhttp.responseText;
		return textRes;
}}
function readFileBackend (fileName, typeFile, callback){
	/* activer le serveur python, serverFile.py
	fileName est le chemin du fichier à partir du dossier où est le serveur
	action: read ou write
	typeFile: article ou text
	*/
	const url = 'http://localhost:1407/serverFile.py';
	const data = { action: action, type: typeFile, file: fileName };
	const dataJson = JSON.stringify (data);
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){ if (this.readyState ==4){
			var resJson = JSON.parse (this.responseText);
			callback (resJson);
		}};
		xhttp.open ('POST', url, true);
		xhttp.send (dataJson);
		return null;
	}else{
		// méthode synchrone
		xhttp.open ('POST', url, false);
		xhttp.send (dataJson);
		var jsonRes = null;
		if (xhttp.status ==0 || xhttp.status ==200) jsonRes = JSON.parse (xhttp.responseText);
		return jsonRes;
}}
function fromJson (jsonFile, callback){
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){ if (this.readyState ==4){
			var jsonRes = JSON.parse (this.responseText);
			callback (jsonRes);
		}};
		xhttp.open ('GET', jsonFile, true);
		xhttp.send();
		return null;
	}else{
		// méthode synchrone
		xhttp.open ('GET', jsonFile, false);
		xhttp.send();
		var jsonRes = null;
		if (xhttp.status ==0 || xhttp.status ==200) jsonRes = JSON.parse (xhttp.responseText);
		return jsonRes;
}}
function fromTsv (tsvFile, callback){
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){
			if (this.readyState ==4){
				var textRes = this.responseText.cleanTxt();
				var listRes =[];
				if (textRes) listRes = textRes.fromTsv();
				callback (listRes);
		}};
		xhttp.open ('GET', tsvFile, true);
		xhttp.send();
		return null;
	}
	else{
		// méthode synchrone
		xhttp.open ('GET', tsvFile, false);
		xhttp.send();
		var listRes =[];
		if (xhttp.status ==0 || xhttp.status ==200){
			var textRes = xhttp.responseText.cleanTxt();
			if (textRes) listRes = textRes.fromTsv();
		}
		return listRes;
}}
// les url
charToEncode =[ ['=', 'xxx'], ['?', 'qqq'], ['&', 'ddd'] ];
charToEncodePlus =[ ['%20', ' '] ];
paramToUrl = function (url, params){
	if (params){
		url = url +'?';
		for (p in params) if (p !== 'fill'){
			if (typeof (params[p]) == 'string') for (var c=0; c< charToEncode.length; c++)
				params[p] = params[p].replace (charToEncode[c][0], charToEncode[c][1]);
			else params[p] = params[p].toString();
			url = url +p+'='+ params[p] +'&';
		}
		url = url.slice (0,-1);
	}
	url = encodeURI (url);
	return url;
}
paramFromUrl = function (url){
	url = decodeURI (url);
	var d= url.indexOf ('?') +1;
	if (d==0) return {};
	var paramText = url.slice (d);
	var paramList = paramText.split ('&');
	var params ={};
	for (var p=0; p< paramList.length; p++){
		paramList[p] = paramList[p].split ('=');
		for (var c=0; c< charToEncode.length; c++) paramList[p][1] = paramList[p][1].replace (charToEncode[c][1], charToEncode[c][0]);
		params [paramList[p][0]] = paramList[p][1];
	}
	return params;
}
Location.prototype.getParams = function(){
	let params ={};
	if (this.search && this.search.length >1){
		let queryStr = this.search.slice (1, this.search.length);
		queryStr = queryStr.replace ('=', '&')
		const queryLst = queryStr.split ('&');
		for (var i=0; i< queryLst.length; i=i+2) params [queryLst[i]] = queryLst[i+1];
	}
	return params;
}
function fromBackend (url, params, callback){
	url = paramToUrl (url, params);
	var res = fromJson (url, callback);
	return res;
}
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
	if (! title ||! title.containList (extentions)) return null;
	else if (title.contain ('/') || title.contain (sep)) return null;
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
