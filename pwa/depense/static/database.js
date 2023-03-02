const databaseName = 'depense';

const pathLocal = 'http://localhost/site-dp/pwa/' + databaseName + '/php/';
const pathOvh = 'https://deborah-powers.fr/pwa/' + databaseName + '/php/';
const pathApp = pathOvh;

const pathAdd = pathApp + 'add.php?';
const pathDel = pathApp + 'del.php?id=';
const pathGet = pathApp + 'get.php';

const idbBase = databaseName + '_db';
const idbStore = databaseName + '_store';

function createItem (item){
	item['etat'] = 'new';
	item['id'] = new Date().getTime();
}
itemToUrl = function (url, item){
	var urlItem = url;
	for (p in item){
		if (item[p].constructor.name == 'Number') item[p] = item[p].toString();
		else if (item[p].constructor.name != 'String') continue;
		urlItem = urlItem +p+'='+ item[p] +'&';
	}
	urlItem = urlItem.slice (0,-1);
	urlItem = encodeURI (urlItem);
	return urlItem;
}
function getFromOdb (pathApp){
	// récupère une liste d'objets
	if (window.navigator.onLine){
		var xhttp = new XMLHttpRequest();
		xhttp.open ('GET', pathGet, false);
		xhttp.send();
		if (xhttp.status ==0 || xhttp.status ==200){
			console.log ("la récupération des objets a réussi");
			var items = JSON.parse (xhttp.responseText);
			for (var i=0; i< items.length; i++){
				items[i]['etat'] = 'get';
				items[i].id = parseInt (items[i].id);
			}
			setIdNew (items);
			return items;
		}
		else{
			console.log ("la récupération des objets a échoué");
			return [];
	}}
	else{
		console.log ('la connection internet est fermée');
		return [];
}}
function sendToOdbAdd (item){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', itemToUrl (pathAdd, item), false);
	xhttp.send();
	if (xhttp.status ==0 || xhttp.status ==200){
		console.log ("l'insertion de l'objet a réussi", item.id);
		item.etat = 'get';
	}
	else console.log ("l'insertion de l'objet a échoué", item.id);
}
function sendToOdbUpd (backUrl, item){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', itemToUrl (pathPut, item), false);
	xhttp.send (item);
	if (xhttp.status ==0 || xhttp.status ==200){
		console.log ("la modification de l'objet a réussi", item.id);
		item.etat = 'get';
	}
	else console.log ("la modification de l'objet a réussi", item.id);
}
function sendToOdbDel (backUrl, itemId){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', pathDel + itemId, false);
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
		for (var i=0; i< items.length; i++){
			if (items[i].etat == undefined){
				createItem (items[i]);
				sendToOdbAdd (items[i]);
			}
			else if (items[i].etat === 'new') sendToOdbAdd (items[i]);
			else if (items[i].etat === 'upd') sendToOdbUpd (items[i]);
			else if (items[i].etat === 'del') sendToOdbModifyItem (items[i].id);
		}
	}
	else console.log ('la connection internet est fermée');
}
// vérifier si mon navigateur supporte indexedDB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (! window.indexedDB) console.log ('votre navigateur ne supporte pas indexedDB, vos données ne seront pas conservées dans votre téléphone');

function addToIdb (item){
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 3);
		request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([idbStore], 'readwrite').objectStore (idbStore);
			item['etat'] = 'new';
			item['id'] = new Date().getTime();
			const request = store.add (item);
			request.onerror = function(){ console.log ("l'insertion de l'objet a échoué", item.id); };
			request.onsuccess = function(){ console.log ("l'insertion de l'objet a réussi", item.id); };
}}}
function updToIdb (item){
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 3);
		request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([idbStore], 'readwrite').objectStore (idbStore);
			item['etat'] = 'upd';
			const request = store.put (item);
			request.onerror = function(){ console.log ("la modification de l'objet a échouée", item.id); };
			request.onsuccess = function(){ console.log ("la modification de l'objet a réussi", item.id); };
}}}

function sendToIdb (databaseName, items, callback){
	// item ={ id: 0, etat: 'new (del, upd, get)', autresChamps }
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 3);
		request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([idbStore], 'readwrite').objectStore (idbStore);
			for (var i=0; i< items.length; i++){
				if (items[i].etat == undefined) createItem (items[i]);
				const itemId = items[i].id;
				if (items[i].etat === 'new'){
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
			const store = database.createObjectStore (idbStore, { keyPath: 'id' });
}}}
function getFromIdb (callback){
	var items =[];
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 3);
		request.onerror = function (event){
			console.log ('erreur de chargement de la base de donnée locale');
			items = getFromOdb (databaseName);
			callback (items);
		};
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([idbStore], 'readonly').objectStore (idbStore);
			store.onsuccess = function (event){ console.log ("la récupération de la liste objets à réussi"); };
			store.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
			store.openCursor().onsuccess = function (event){
				var cursor = event.target.result;
				if (cursor){
					items.push (cursor.value);
					cursor.continue();
				}else{
					if (items.length ===0){
						items = getFromOdb (databaseName);
						for (var i=0; i< items.length; i++) items[i].etat = 'new';
						sendToIdb (databaseName, items, callback);
					}
					else{
						setIdNew (items);
						callback (items);
		}}};};
		request.onupgradeneeded = function (event){
			const database = event.target.result;
			database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
			const objectStore = database.createObjectStore (idbStore, { keyPath: 'id' });
		//	getFromIdb (databaseName, callback);
	}}
	else{
		console.log ('votre navigateur ne supporte pas indexedDB');
		items = getFromOdb (databaseName);
		callback (items);
}}