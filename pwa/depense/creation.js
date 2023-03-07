var lieuList =[ 'rueil', 'bnf', 'châtelet', 'auber', 'paris', 'avon', 'chateaudun' ];
var cateList =[ 'courses', 'restaurant', 'transport', 'cadeau', 'ammeublement', 'divers', 'loisir', 'sortie', 'utile' ];

var depDate = new Date().toStringPerso();
var depLieu ="";
var depLieuSel ="";
var depCateg ="";
var depCategSel ="";
var depMontant = '15.0';
var depComm ="";

const params = itemFromUrl();
function setData (res){
	depDate = res.date;
	depLieu = res.lieu;
	depCateg = res.categorie;
	depMontant = res.montant;
	depComm = res.commentaire;
	document.getElementById ('champ-lieu').printOne();
	document.getElementById ('champ-categ').printOne();
}
function returnToPage (id){
	window.location.href = './unique.html?id=' + id;
}
if (params['id']){
	var id = parseInt (params.id);
	nouvelleValeur ('lieu', true);
	nouvelleValeur ('categ', true);
	get (id, setData);
}
dpInit();
// sendOnline();

function nouvelleValeur (nom, affiche){
	const selector = document.getElementById ('select-' + nom);
	if (selector.options [selector.selectedIndex].value === 'nouveau' || affiche){
		selector.style.display = 'none';
		document.getElementById ('champ-' + nom).style.display = 'block';
}}
function entrerDepense(){
	console.log ('coco', id);
	if (depCateg === 'o' || ! exists (depCateg)) depCateg = depCategSel;
	if (depLieu === 'o' || ! exists (depLieu)) depLieu = depLieuSel;
	if (id) putToIdb ({ date: depDate, montant: depMontant, lieu: depLieu, categorie: depCateg, commentaire: depComm, id: id }, returnToPage);
	else addToIdb ({ date: depDate, montant: depMontant, lieu: depLieu, categorie: depCateg, commentaire: depComm }, returnToPage);
	/*
	depDate = new Date().toStringPerso();
	depLieu ="";
	depCateg ="";
	document.body.innerHTML = bodyTemplate;
	dpLoad();
	*/
}
