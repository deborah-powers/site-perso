// variables à utiliser par l'utilisateur, utilisées dans le code
var databaseName = 'comodity';

// vérifier si mon navigateur supporte indexedDB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (! window.indexedDB) console.log ('votre navigateur ne supporte pas indexedDB.');

function connectIdb (callback){
	const request = window.indexedDB.open (databaseName +'_db', 3);
	request.onerror = function (event){ console.log ('erreur de chargement de la base de donnée locale'); };
	request.onsuccess = function (event){ callback (event.target.result); };
	request.onupgradeneeded = function (event){
		const database = event.target.result;
		database.onerror = function (event){ console.log ('erreur de chargement de la base de donnée locale'); };
		const objectStore = database.createObjectStore (databaseName +'_store', { autoIncrement: true });
		// var objectStore = database.createObjectStore (databaseName +'_store', {keyPath: 'name'});
		connectIdb (callback);
}}
function get (itemId, callback){
	function connectionCallback (database){
		const request = database.transaction ([databaseName +'_store'], 'readonly').objectStore (databaseName +'_store').get (itemId);
		request.onerror = function (event){ console.log ("la récupération de l'objet "+ itemId +' à échouée'); };
		request.onsuccess = function(){ callback (request.result); };
	}
	connectIdb (connectionCallback);
}
function add (item, callback){
	function connectionCallback (database){
		const request = database.transaction ([databaseName +'_store'], 'readwrite').objectStore (databaseName +'_store').add (item);
		request.onerror = function (event){ console.log ("l'insertion de l'objet à échouée", item); };
		request.onsuccess = function(){ callback (request.result); };
	}
	connectIdb (connectionCallback);
}
function put (item, callback){
	function connectionCallback (database){
		const request = database.transaction ([databaseName +'_store'], 'readwrite').objectStore (databaseName +'_store').put (item);
		request.onerror = function (event){ console.log ("la modification de l'objet à échouée", item); };
		request.onsuccess = function(){ callback (request.result); };
	}
	connectIdb (connectionCallback);
}
function getAll (callback){
	function connectionCallback (database){
		var itemList =[];
		var objectStore = database.transaction (databaseName +'_store').objectStore (databaseName +'_store');
		objectStore.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
		objectStore.openCursor().onsuccess = function (event){
			var cursor = event.target.result;
			if (cursor){
				itemList.push (cursor.value);
				cursor.continue();
			}
			else callback (itemList);
	}}
	connectIdb (connectionCallback);
}
function del (itemId){
	function connectionCallback (database){
		const request = database.transaction ([databaseName +'_store'], 'readwrite').objectStore (databaseName +'_store').delete (itemId);
		request.onerror = function (event){ console.log ("la suppression de l'objet "+ itemId +' à échouée'); };
		request.onsuccess = function (event){ console.log ("la suppression de l'objet "+ itemId +' à réussie'); };
	}
	connectIdb (connectionCallback);
}
function sendToIdb (databaseName, items){
	// item ={ id: 0, etat: 'new (del, upd, get)', autresChamps }
	const request = window.indexedDB.open (databaseName +'_db', 3);
	request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
	request.onsuccess = function (event){
		const store = event.target.result.transaction ([databaseName +'_store'], 'readwrite').objectStore (databaseName +'_store');
		for (var i=0; i< items.lenght; i++){
			if (items[i].etat === 'new'){
				// items[i].etat = 'get';
				const request = store.add (items[i]);
				request.onerror = function(){ console.log ("l'insertion de l'objet a échouée", items[i].id); };
				request.onsuccess = function(){ console.log ("l'insertion de l'objet a réussi", items[i].id); }
			}
			else if (items[i].etat === 'upd'){
				const request = store.put (items[i]);
				request.onerror = function(){ console.log ("la modification de l'objet a échouée", items[i].id); };
				request.onsuccess = function(){ console.log ("la modification de l'objet a réussi", items[i].id); }
			}
			else if (items[i].etat === 'del'){
				const itemId = items[i];
				const request = store.delete (items[i]);
				request.onerror = function(){ console.log ("la suppression de l'objet a échouée", itemId); };
				request.onsuccess = function(){ console.log ("la modification de l'objet a réussi", itemId); }
	}}};
	request.onupgradeneeded = function (event){
		const database = event.target.result;
		database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		const store = database.createObjectStore (databaseName +'_store', { keyPath: 'id' });
		sendToIdb (databaseName, items);
}}
function getFromIdb (databaseName, callback){
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
			}
			else{
				for (var i=0; i< items.lenght; i++) if (items[i].etat !== 'get') items[i].etat = 'get';
				callback (items);
	}}};
	request.onupgradeneeded = function (event){
		const database = event.target.result;
		database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		const objectStore = database.createObjectStore (databaseName +'_store', { keyPath: 'id' });
		getFromIdb (databaseName);
}}