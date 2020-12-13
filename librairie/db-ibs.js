/* script pour récupérer des données simples d'une base indexed-db et les échanger avec une base sql
dépendences: text.js, file.js, db-idb.js, list.js, db-sql.js, database.php, database.class.php
les objets ont un identifiant id
*/
class DbIdbBus extends DbIdb{
	constructor (name){
		super (name);
		// faire la liaison avec sql
		this.idsDeleted =[];
		this.idsUpdated =[];
		this.idsCreated =[];
		this.dbSql = null;
	}
delete (id){
	var idNb = parseKey (id);
	var request = this.database.transaction ([this.storeName], 'readwrite').objectStore (this.storeName).delete (idNb);
	var that = this;
	request.onsuccess = function (event){
		console.log ("l'article n°"+ id +' à été supprimé');
		var pos = that.idsCreated.index (idNb);
		if (pos >=0) that.idsCreated.pop (pos);
		else that.idsDeleted.push (idNb);
		pos = that.idsUpdated.index (idNb);
		if (pos >=0) that.idsUpdated.pop (pos);
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
		that.idsCreated.push (event.target.result)
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
		var pos = that.idsCreated.index (itemSingle.id);
		if (pos <=-1) that.idsUpdated.push (itemSingle.id);
		that.list();
	}
	request.onerror = function (event){ console.log ("l'article n°"+ itemSingle.id +" n'a pas put être enregistré"); }
}
createSql (type, path, fieldList){
	this.dbSql = new DbSql (this.name, type, path);
	this.dbSql.create ([], fieldList);
}
sendToSql(){
	console.dir (this.idsCreated);
	console.dir (this.idsUpdated);
	console.dir (this.idsDeleted);
	for (var i=0; i< this.idsCreated.length; i++)
}
}