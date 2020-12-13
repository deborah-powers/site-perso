/* classe basique pour les bdd
dépendences: text.js, file.js
les éléments ont un champ id
*/
class DbInterface{
	constructor (name){ this.name = name; }
	// fonctions à adapter selon le type de base de donnée
	createTable (itemList, fieldList){}
	list(){}
	select (id){}
	delete (id){}
	create (itemSingle){
		if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	}
	update (itemSingle){
		if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
	}
	crorup (itemSingle){
		if (! itemSingle || itemSingle == undefined) itemSingle = this.getItem();
		if (! itemSingle.id){
			delete itemSingle.id;
			this.create (itemSingle);
		}
		else this.update (itemSingle);
	}
	// fonctions à adapter selon le projet
	callbackList (items){}
	callbackSelect (item){}
	getItem(){}
}