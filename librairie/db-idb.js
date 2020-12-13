/* script pour récupérer des données simples d'une base indexed-db
dépendences: text.js, file.js, db-interface.js
les objets ont un identifiant id
*/
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
function parseKey (id){
	var idNb =0;
	if (id && typeof (id) == 'string') idNb = parseInt (id);
	else if (id) idNb = id;
	return idNb;
}
class DbIdb extends DbInterface{
	constructor (name){
		super (name);
		this.storeName = this.name + '_store';
		this.database = null;
	}
createTable (itemList, indexList){
	if (window.indexedDB){
		var requestDb = window.indexedDB.open (this.name, 3);
		var that = this;
		requestDb.onerror = function (event){ console.log ('erreur de chargement de la base de donnée', that.name); }
		requestDb.onsuccess = function (event){
			that.database = requestDb.result;
			that.list();
		}
		requestDb.onupgradeneeded = function (event){
			var database = event.target.result;
			var objectStore = database.createObjectStore (that.storeName, { keyPath: 'id', autoIncrement: true });
			// les index
			if (indexList) for (var id in indexList)
				objectStore.createIndex (id, id, { unique: indexList[id] });
			for (var i=0; i< itemList.length; i++) objectStore.add (itemList[i]);
	}}
	else console.log ('votre navigateur ne supporte pas indexed-db');
}
list(){
	var itemList =[];
	var objectStore = this.database.transaction (this.storeName).objectStore (this.storeName);
	var that = this;
	// var objectStore = this.database.transaction (this.storeName).objectStore (this.storeName);
	objectStore.openCursor().onerror = function (event){ console.log ("la liste d'article n'a pas put être récupérée"); }
	objectStore.openCursor().onsuccess = function (event){
		var cursor = event.target.result;
		if (cursor){
			cursor.value['id'] = cursor.key;
			itemList.push (cursor.value);
			cursor.continue();
		}
		else{
			console.log ('les articles ont été récupérés');
			that.callbackList (itemList);
}}}
select (id){
	var idNb = parseKey (id);
	var that = this;
	var request = this.database.transaction ([that.storeName]).objectStore (that.storeName).get (idNb);
	request.onerror = function (event){ console.log ('impossible de récupérer les articles'); }
	request.onsuccess = function (event){
		if (request.result){
			request.result['id'] = idNb;
			that.callbackSelect (request.result);
		}
		else console.log ("l'article n°"+ id +" n'est pas dans la base");
}}
delete (id){
	var idNb = parseKey (id);
	var request = this.database.transaction ([this.storeName], 'readwrite').objectStore (this.storeName).delete (idNb);
	var that = this;
	request.onsuccess = function (event){
		console.log ("l'article n°"+ id +' à été supprimé');
		that.list();
	}
	request.onerror = function (event){ console.log ("l'article n°"+ id +" n'à pas put être supprimé"); }
}
create (itemSingle){
	if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	var store = this.database.transaction ([this.storeName], 'readwrite').objectStore (this.storeName);
	var that = this;
	var request = store.add (itemSingle);
	request.onsuccess = function (event){
		console.log ("l'article est créé");
		that.list();
	}
	request.onerror = function (event){ console.log ("l'article n'a pas put être créé"); }
}
update (itemSingle){
	if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	itemSingle.id = parseKey (itemSingle.id);
	var store = this.database.transaction ([this.storeName], 'readwrite').objectStore (this.storeName);
	var that = this;
	var request = store.put (itemSingle);
	request.onsuccess = function (event){
		console.log ("l'article n°"+ itemSingle.id +' est enregistré');
		that.list();
	}
	request.onerror = function (event){ console.log ("l'article n°"+ itemSingle.id +" n'a pas put être enregistré"); }
}
}