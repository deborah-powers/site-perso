// dépendence: text.js

// les fichiers
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
function useJson (jsonFile){ return JSON.parse (fromFile (jsonFile)); }
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
paramToUrl = function (url, params){
	if (params){
		url = url +'?';
		for (p in params){
			for (var c=0; c< charToEncode.length; c++) params[p] = params[p].replace (charToEncode[c][0], charToEncode[c][1]);
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
	var url = paramToUrl (url, params);
	var textRes = fromFile (url);
	var value = null;
	if (textRes) value = JSON.parse (textRes);
	return value;
}
function useBackendAssync (url, callback, params){
	var url = paramToUrl (url, params);
	fromFileAssync (url, callback);
}