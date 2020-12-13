/* script pour récupérer des données simples d'une base sql
dépendences: text.js, file.js, database.php, database.class.php, db-interface.js
forme des url: http://url?action=coucou&id=2&a=b
valeurs de type
	ovh		utiliser seulement une base sql sur ovh
	lcl		utiliser seulement une base sql en local
les objets ont un identifiant id
*/
const pathLocal = 'http://localhost/site-dp/';
const pathOvh = 'http://deborah-powers.fr/';
class DbSql extends DbInterface{
	constructor (name, type, path){
		super (name);
		this.urlBase = pathLocal;
		if (type == 'ovh') this.urlBase = pathOvh;
		if (path){
			if (path.slice (-1) != '/') path = path +'/';
			this.urlBase = this.urlBase + path;
		}
		this.urlBase = this.urlBase + this.name +'/database.php';
	}
logUrl = function (params){
	var urlTmp = paramToUrl (this.urlBase, params);
	console.log (urlTmp);
}
// le crud
list(){
	var itemList = useBackend (this.urlBase, { action: 'list' });
	if (itemList){
		console.log ('les articles ont été récupérés');
		this.callbackList (itemList);
	}
	else console.log ("la liste d'article n'a pas put être récupérée");
}
createTable (itemList, fieldList){
	fieldList['action'] = 'table';
	var res = useBackend (this.urlBase, fieldList);
	if (res ==1){
		console.log ('la table sql à été créée');
		for (var i in itemList) this.create (itemList[i]);
		console.log ('la table sql à été remplie');
		this.list();
	}
	else if (res ==2){
		console.log ('la table sql existe déjà');
		/*
		for (var i in itemList) this.create (itemList[i]);
		console.log ('la table sql à été remplie'); */
		this.list();
	}
	else console.log ("la table sql n'a pas put être créée");
}
select (id){
	var itemSingle = useBackend (this.urlBase, { action: 'select', id: id });
	this.callbackSelect (itemSingle);
}
delete (id){
	var value = useBackend (this.urlBase, { action: 'delete', id: id });
	console.log ("l'article n°"+ id +' à été supprimé');
	this.list();
}
create (itemSingle){
	if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	itemSingle['action'] = 'create';
	var value = useBackend (this.urlBase, itemSingle);
	this.logUrl (itemSingle)
	if (value) console.log ("l'article a été créé");
	else console.log ("l'article n'a pas put être créé");
	this.list();
}
update (itemSingle){
	if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	itemSingle['action'] = 'update';
	var value = useBackend (this.urlBase, itemSingle);
	if (value) console.log ("l'article a été modifié");
	else console.log ("l'article n'a pas put être modifié");
	this.list();
}
}
// 2020-06-07
