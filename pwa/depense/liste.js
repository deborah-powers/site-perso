const params = itemFromUrl();
var mydate = new Date();
const today = mydate.toStringPerso();
mydate.setDate (mydate.getDate() -7);
const lastweek = mydate.toStringPerso();
var depenseList =[{ date: '2023-02-14', montant: '12.4', lieu: 'paris', categorie: 'sortie', commentaire: 'ras' }];
var total =0;
var totalCategories ={};

function trierDepenses (depenseA, depenseB){
	if (depenseA.date < depenseB.date) return -1;
	else if (depenseA.date > depenseB.date) return 1;
	else if (depenseA.lieu < depenseB.lieu) return -1;
	else if (depenseA.lieu > depenseB.lieu) return 1;
	else if (depenseA.categorie < depenseB.categorie) return -1;
	else if (depenseA.categorie > depenseB.categorie) return 1;
	else if (depenseA.montant < depenseB.montant) return -1;
	else if (depenseA.montant > depenseB.montant) return 1;
	else if (depenseA.commentaire < depenseB.commentaire) return -1;
	else if (depenseA.commentaire > depenseB.commentaire) return 1;
	else return 1;
}
function afficher (depList){
	depenseList =[];
	total =0;
	totalCategories ={}
	if (exists (depList)){
		depList.sort (trierDepenses);
		for (var d=0; d< depList.length; d++){
			depList[d].montant = parseFloat (depList[d].montant);
			depenseList.push (depList[d]);
			total = total + depList[d].montant;
			if (totalCategories [depList[d].categorie]) totalCategories [depList[d].categorie] = totalCategories [depList[d].categorie] + depList[d].montant;
			else totalCategories [depList[d].categorie] = depList[d].montant;
	}}
	dpInit();
}
function selecDay (depense){
	if (depense.date >= today) return true;
	else return false;
}
function selectWeek (depense){
	if (depense.date >= lastweek) return true;
	else return false;
}
var periodeMessage ="";
if (params.type === 'day'){
	periodeMessage = 'du jour';
	getList (afficher, selecDay);
}
else if (params.type === 'week'){
	periodeMessage = 'de la semaine';
	getList (afficher, selectWeek);
}
else getList (afficher);
