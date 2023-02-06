var backUrl = '';

function createConnection (pathApp){
	backUrl = pathBackend + pathApp;
	if (backUrl [backUrl.length -1] !='/') backUrl = backUrl +'/';
}
function fromBackend (url, params, callback){
	url = paramToUrl (url, params);
	var xhttp = new XMLHttpRequest();
	if (callback){
		// méthode assynchrone
		xhttp.onreadystatechange = function(){ if (this.readyState ==4){
			var jsonRes = JSON.parse (this.responseText);
			callback (jsonRes);
		}};
		xhttp.open ('GET', url, true);
		xhttp.send();
		return null;
	}
	else{
		// méthode synchrone
		xhttp.open ('GET', url, false);
		xhttp.send();
		var jsonRes = null;
		if (xhttp.status ==0 || xhttp.status ==200) jsonRes = JSON.parse (xhttp.responseText);
		return jsonRes;
}}
function get (itemId){
	var addUrl = backUrl + 'add.php';



}