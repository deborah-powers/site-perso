/* dépendence: text.js
les fichiers
*/
const extentionsImg =[ 'bmp', 'svg', 'jpg', 'jpeg', 'png', 'gif' ];
const extentions =[ 'js', 'py', 'php', 'java', 'sql', 'css', 'txt', 'html', 'htm', 'xml', 'json', 'csv', 'tsv', 'mp3', 'mp4' ]
	.concat (extentionsImg);


function fromFile (fileName){
	// mes fichiers sont petits, j'utilise les requêtes synchrones, simples à traiter
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', fileName, false);
	xhttp.send();
	var textRes = null;
	if (xhttp.status ==0 || xhttp.status ==200) textRes = xhttp.responseText;
	return textRes;
}
function fromFileAssync (fileName, callback){
	if (callback){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){ if (this.readyState ==4) callback (this.responseText); };
		xhttp.open ('GET', jsonFile, true);
		xhttp.send();
	}
	else console.log ('pas de callback, les données de', fileName, 'ne peuvent pas être utilisée');
}
function useJson (jsonFile){
	var textRes = fromFile (jsonFile);
	return JSON.parse (textRes);
}
function useTsv (tsvFile){
	var textRes = fromFile (tsvFile);
	textRes = textRes.clean();
	var listRes =[];
	if (textRes){
		listRes = textRes.split ('\n');
		for (var l=0; l< listTmp.length; l++) listRes[l] = listRes[l].split ('\t');
	}
	return listRes;
}
// les url
charToEncode =[ ['=', 'xxx'], ['?', 'qqq'], ['&', 'ddd'] ];
charToEncodePlus =[ ['%20', ' '] ];
paramToUrl = function (url, params){
	if (params){
		url = url +'?';
		for (p in params){
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
function useBackend (url, params){
	url = paramToUrl (url, params);
	var textRes = fromFile (url);
	var value = null;
	if (textRes) value = JSON.parse (textRes);
	return value;
}
function useBackendAssync (url, callback, params){
	var url = paramToUrl (url, params);
	fromFileAssync (url, callback);
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