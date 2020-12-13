document.body.init();
debbyPlay.book ={ title: '', price: 0, date: '', autor: '' };
debbyPlay.books =[
	{ title: "l'histoire sans fin", price: "20", date: '1979-07-02', autor: 'michael ende' },
	{ title: 'alice au pays des merveilles', price: "15", date: '1865-07-02', autor: 'lewis carroll' },
	{ title: 'villa esseling monde', price: "10", date: '1985-07-02', autor: 'philippe dorin' }
];
var bdd = new DbIdbBus ('librairie');
/*
var bdd = new DbIdb ('librairie');
var bdd = new DbSql ('librairie', 'lcl', 'portfolio');
*/
bdd.callbackList = function (itemList){
	debbyPlay.books = itemList;
	debbyPlay.book ={ title: '', price: 0, date: '', autor: '' };
	document.body.load();
}
bdd.callbackSelect = function (itemSingle){
	debbyPlay.book = itemSingle;
	document.body.load();
}
bdd.getItem = function(){
	var inputs = document.getElementsByTagName ('input');
	debbyPlay.book.id = inputs[0].value;
	debbyPlay.book.title = inputs[1].value;
	debbyPlay.book.autor = inputs[2].value;
	debbyPlay.book.date = inputs[3].value;
	debbyPlay.book.price = inputs[4].value;
	if (debbyPlay.book.id.contain ('((')) delete debbyPlay.book.id;
	else debbyPlay.book.id = parseInt (debbyPlay.book.id);
	return debbyPlay.book;
}
const indexList ={ title: true, autor: false, date: false };
const fieldList ={ title: 'varchar(200) not null', autor: 'varchar(200) not null', date: 'date not null', price: 'int(3) not null' };
bdd.createTable (debbyPlay.books, indexList);
bdd.createSql ('lcl', 'portfolio', fieldList);
