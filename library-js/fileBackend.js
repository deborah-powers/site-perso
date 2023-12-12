/* fonctions pour ouvrir des fichiers utilisant un backend python
dépendences:
	text.js
	fileBackend.py
arguments:
	fileName: chemin du fichier à partir du dossier où est le serveur
	typeFile: article ou text
	text: texte à écrire
*/
const urlBackend = 'http://localhost:1407/serverFile.py';
function readFile (fileName, callback){ return doPost (fileName, 'text', callback, "", {}); }
function readArticle (fileName, callback){ return doPost (fileName, 'article', callback, "", {}); }
function writeFile (fileName, text, callback){ return doPost (fileName, 'text', callback, text, {}); }
function writeArticle (fileName, text, callback, subject, link, author, authLink){
	const fileData ={ link: link, subject: subject, author: author, authLink: authLink };
	return doPost (fileName, 'article', callback, text, fileData);
}
function doPost (fileName, type, callback, text, fileData){
	/*
	fileData = null pour lire
	fileData = null pour écrire un fichier simple
	fileData ={ subject, author, link, authLink } pour écrire un article
	*/
	fileData.file = fileName;
	fileData.type = type;
	const dataJson = JSON.stringify (fileData);
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){ if (this.readyState ==4){
			var resJson = JSON.parse (this.responseText);
			callback (resJson);
		}};
		xhttp.open ('POST', urlBackend, true);
		xhttp.send (dataJson);
		return null;
	}else{
		// méthode synchrone
		xhttp.open ('POST', urlBackend, false);
		xhttp.send (dataJson);
		var jsonRes = null;
		if (xhttp.status ==0 || xhttp.status ==200){
			jsonRes = JSON.parse (xhttp.responseText);
		}
		return jsonRes;
}}