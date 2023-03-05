/* variables à utiliser par l'utilisateur, utilisées dans le code
item = { id: nombre, etat: string, autres }
*/
const databaseName = 'depense';

const pathLocal = 'http://localhost/site-dp/pwa/' + databaseName + '/php/';
const pathOvh = 'https://deborah-powers.fr/pwa/' + databaseName + '/php/';
const pathApp = pathLocal;

const pathAdd = pathApp + 'add.php?';
const pathDel = pathApp + 'del.php?id=';
const pathGet = pathApp + 'get.php?id=';
const pathList = pathApp + 'list.php';

const idbBase = databaseName + '_db';
const idbStore = databaseName + '_store';
const idbStoreDeleted = databaseName + '_del_store';

function itemToUrl (item, url){
	var urlItem ="";
	for (p in item){
		if (item[p].constructor.name == 'Number') item[p] = item[p].toString();
		else if (item[p].constructor.name != 'String') continue;
		urlItem = urlItem +'&'+p+'='+ item[p];
	}
	urlItem = urlItem.slice (1);
	urlItem = '?'+ urlItem;
	urlItem = encodeURI (urlItem);
	if (exists (url)){
		urlItem = url + urlItem;
		return urlItem;
	}
	else{
		window.location.search = urlItem;
		window.location.href = window.location.href + urlItem;
		return window.location.href;
	}
}
// vérifier si mon navigateur supporte indexedDB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (! window.indexedDB) console.log ('votre navigateur ne supporte pas indexedDB. vos données ne pourront pas être stoquées sur votre appareil.');

function connectIdb (callback){
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 4);
		request.onerror = function (event){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){ callback (event.target.result); };
		request.onupgradeneeded = function (event){
			const database = event.target.result;
			database.onerror = function (event){ console.log ('erreur de chargement de la base de donnée locale'); };
			// const objectStore = database.createObjectStore (idbStore, { autoIncrement: true });
			const objectStore = database.createObjectStore (idbStore, {keyPath: 'id'});
			const objectStoreDel = database.createObjectStore (idbStoreDeleted, {keyPath: 'id'});
			connectIdb (callback);
}}}
function addToIdb (item, callback){
	function connectionCallback (database){
		if (! exists (item['id'])){
			item['id'] = new Date().getTime();
			item['etat'] = 'new';
		}
		const request = database.transaction ([idbStore], 'readwrite').objectStore (idbStore).add (item);
		request.onerror = function (event){ console.log ("l'insertion de l'objet à échouée", item); };
		request.onsuccess = function(){ callback (request.result); };
	}
	connectIdb (connectionCallback);
}
function putToIdb (item, callback){
	function connectionCallback (database){
		const request = database.transaction ([idbStore], 'readwrite').objectStore (idbStore).put (item);
		request.onerror = function (event){ console.log ("la modification de l'objet à échouée", item); };
		request.onsuccess = function(){
			request.result.etat = 'upd';
			if (callback) callback (request.result);
		};
	}
	connectIdb (connectionCallback);
}
function delFromIdb (itemId){
	function connectionCallback (database){
		/*
		const transaction = database.transaction ([idbStore, idbStoreDeleted], 'readwrite');
		const request = transaction.objectStore (idbStore).delete (itemId);
		const requestBis = transaction.objectStore (idbStoreDeleted).add ({ id: itemId });
		*/
		const request = database.transaction ([idbStore, idbStoreDeleted], 'readwrite').objectStore (idbStore).delete (itemId);
		request.onerror = function (event){ console.log ("la suppression de l'objet "+ itemId +' à échouée'); };
		request.onsuccess = function (event){ console.log ("la suppression de l'objet "+ itemId +' à réussie'); };
		const requestBis = database.transaction ([idbStoreDeleted], 'readwrite').objectStore (idbStoreDeleted).add ({ id: itemId });
		requestBis.onerror = function (event){ console.log ("la suppression de l'objet "+ itemId +' à échouée'); };
		requestBis.onsuccess = function (event){ console.log ("la suppression de l'objet "+ itemId +' à réussie'); };
	}
	connectIdb (connectionCallback);
}
function sendOnline(){
	function getDeletedId (database){
		var itemList =[];
		var store = database.transaction (idbStoreDeleted).objectStore (idbStoreDeleted);
		store.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
		store.openCursor().onsuccess = function (event){
			var cursor = event.target.result;
			if (cursor){
				itemList.push (cursor.value);
				cursor.continue();
			}
			else console.log (itemList);
	}}	connectIdb (getDeletedId);
}
function get (itemId, callback){
	function connectionCallback (database){
		const request = database.transaction ([idbStore], 'readonly').objectStore (idbStore).get (itemId);
		request.onsuccess = function(){ callback (request.result); };
		request.onerror = function (event){
			if (window.navigator.onLine){
				const xhttp = new XMLHttpRequest();
				xhttp.open ('GET', pathGet + itemId, false);
				xhttp.send();
				if (xhttp.status ==0 || xhttp.status ==200){
					var item = JSON.parse (this.responseText);
					item['etat'] = 'get';
					console.log (callback);
					addToIdb (item, callback);
			}}	else console.log ("la récupération de l'objet "+ itemId +' à échouée');
	};}	connectIdb (connectionCallback);
}
function getList (callback){
	function connectionCallback (database){
		var itemList =[];
		var store = database.transaction (idbStore).objectStore (idbStore);
		store.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
		store.openCursor().onsuccess = function (event){
			var cursor = event.target.result;
			if (cursor){
				itemList.push (cursor.value);
				cursor.continue();
			}
			else if (! exists (itemList)) if (window.navigator.onLine){
				const xhttp = new XMLHttpRequest();
				xhttp.open ('GET', pathList, false);
				xhttp.send();
				if (xhttp.status ==0 || xhttp.status ==200){
					itemList = JSON.parse (this.responseText);
					for (var i=0; i< itemList.length; i++){
						itemList[i]['etat'] = 'get';
						addToIdb (itemList[i], null);
					}
					if (callback) callback (itemList);
			}}	else if (callback) callback (itemList);
	}}	connectIdb (connectionCallback);
}