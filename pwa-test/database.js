// variable à régler par l'utilisateur
var pathApp ="";
var pathAdd ="";
var pathPut ="";
var pathDel ="";
// vérifier si mon navigateur supporte indexedDB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

itemToUrl = function (url, item){
	var urlItem = url;
	for (p in item){
		if (typeof (item[p]) != 'string') item[p] = item[p].toString();
		urlItem = urlItem +p+'='+ item[p] +'&';
	}
	urlItem = urlItem.slice (0,-1);
	urlItem = encodeURI (urlItem);
	console.log (urlItem);
	return urlItem;
}
function createConnectionOdb (pathApp){
	// les fichiers php doivent être adaptés à l'application
	if (pathApp [pathApp.length -1] !='/') pathApp = pathApp +'/';
	pathApp = pathBackend + pathApp + 'php/';
	pathAdd = pathApp + 'add.php?';
	pathPut = pathApp + 'put.php?';
	pathDel = pathApp + 'del.php?';
}
function sendToOdbAdd (item){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', itemToUrl (pathAdd, item), false);
	xhttp.send();
	if (xhttp.status ==0 || xhttp.status ==200) console.log ("l'insertion de l'objet a réussi", item.id);
	else console.log ("l'insertion de l'objet a réussi", item.id);
}
function sendToOdbUpd (backUrl, item){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', itemToUrl (pathPut), false);
	xhttp.send (item);
	if (xhttp.status ==0 || xhttp.status ==200) console.log ("la modification de l'objet a réussi", item.id);
	else console.log ("la modification de l'objet a réussi", item.id);
}
function sendToOdbDel (backUrl, itemId){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', itemToUrl (pathDel), false);
	xhttp.send (item);
	if (xhttp.status ==0 || xhttp.status ==200) console.log ("la suppression de l'objet a réussi", itemId);
	else console.log ("la suppression de l'objet a réussi", itemId);
}
function sendToOdb (pathApp, items){
	/*
	window.addEventListener ('online', function(){ pConnection.innerHTML = "la connection internet vient de s'ouvrir"; });
	window.addEventListener ('offline', function(){ pConnection.innerHTML = 'la connection internet vient de se fermer'; });
	*/
	if (window.navigator.onLine){
		createConnectionOdb (pathApp);
		sendToOdbAdd (items[0]);
		/*
		for (var i=0; i< items.length; i++){
			if (items[i].etat === 'new') sendToOdbAdd (items[i]);
			else if (items[i].etat === 'upd') sendToOdbUpd (items[i]);
			else if (items[i].etat === 'del') sendToOdbModifyItem (items[i].id);
		}*/
	}
	else console.log ('la connection internet est fermée');
}
function sendToIdb (databaseName, callback, items){
	// item ={ id: 0, etat: 'new (del, upd, get)', autresChamps }
	if (! window.indexedDB) console.log ('votre navigateur ne supporte pas indexedDB');
	else{
		const request = window.indexedDB.open (databaseName +'_db', 3);
		request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([databaseName +'_store'], 'readwrite').objectStore (databaseName +'_store');
			for (var i=0; i< items.length; i++){
				const itemId = items[i].id;
				if (items[i].etat === 'new'){
					// items[i].etat = 'get';
					const request = store.add (items[i]);
					request.onerror = function(){ console.log ("l'insertion de l'objet a échouée", itemId); };
					request.onsuccess = function(){ console.log ("l'insertion de l'objet a réussi", itemId); };
				}
				else if (items[i].etat === 'upd'){
					const request = store.put (items[i]);
					request.onerror = function(){ console.log ("la modification de l'objet a échouée", itemId); };
					request.onsuccess = function(){ console.log ("la modification de l'objet a réussi", itemId); };
				}
				else if (items[i].etat === 'del'){
					const request = store.delete (items[i]);
					request.onerror = function(){ console.log ("la suppression de l'objet a échouée", itemId); };
					request.onsuccess = function(){ console.log ("la modification de l'objet a réussi", itemId); };
			}}
			callback (items);
		};
		request.onupgradeneeded = function (event){
			const database = event.target.result;
			database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
			const store = database.createObjectStore (databaseName +'_store', { keyPath: 'id' });
		//	sendToIdb (databaseName, callback, items);
}}}
function getFromIdb (databaseName, callback){
	if (! window.indexedDB) console.log ('votre navigateur ne supporte pas indexedDB');
	else{
		var items =[];
		const request = window.indexedDB.open (databaseName +'_db', 3);
		request.onerror = function (event){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([databaseName +'_store'], 'readonly').objectStore (databaseName +'_store');
			store.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
			store.openCursor().onsuccess = function (event){
				var cursor = event.target.result;
				if (cursor){
					items.push (cursor.value);
					cursor.continue();
				}else{
					for (var i=0; i< items.length; i++) if (items[i].etat != 'get') items[i].etat = 'get';
					callback (items);
		}}};
		request.onupgradeneeded = function (event){
			const database = event.target.result;
			database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
			const objectStore = database.createObjectStore (databaseName +'_store', { keyPath: 'id' });
		//	getFromIdb (databaseName, callback);
}}}