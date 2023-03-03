var lieuList =[ 'rueil', 'bnf', 'châtelet', 'auber', 'paris', 'avon', 'chateaudun' ];
var cateList =[ 'courses', 'restaurant', 'transport', 'cadeau', 'ammeublement', 'divers', 'loisir', 'sortie', 'utile' ];

var depDate = new Date().toStringPerso();
var depLieu ="o";
var depLieuSel ="o";
var depCateg ="o";
var depCategSel ="o";
var depMontant = '15.0';
var depComm = 'ok';
dpInit();

function nouvelleValeur (nom){
	const selector = document.getElementById ('select-' + nom);
	if (selector.options [selector.selectedIndex].value === 'nouveau'){
		selector.style.display = 'none';
		document.getElementById ('champ-' + nom).style.display = 'block';
}}
function entrerDepense(){
	if (depCateg === 'o') depCateg = depCategSel;
	if (depLieu === 'o') depLieu = depLieuSel;
	addToIdb ({ date: depDate, montant: depMontant, lieu: depLieu, categorie: depCateg, commentaire: depComm });
	depDate = new Date().toStringPerso();
	depLieu ="o";
	depCateg ="o";
	document.body.innerHTML = bodyTemplate;
	dpLoad();
}
function insererDepense (nvDepense){
	if (nvDepense.etat === 'new') depenseList.push (nvDepense);
	else if (nvDepense.etat === 'upd') for (var d=0; d< depenseList.length; d++) if (depenseList[d].id === nvDepense.id){
		depenseList[d].date = nvDepense.date;
		depenseList[d].lieu = nvDepense.lieu;
		depenseList[d].categorie = nvDepense.categorie;
		depenseList[d].montant = nvDepense.montant;
		depenseList[d].commentaire = nvDepense.commentaire;
	}
	window.location.href = './unique.html?id=' + nvDepense.id;
}
