// identifier l'aiguille et les couleurs
const aiguilles = document.getElementsByTagName ('polygon');
var aiguilleId =0;
const echantillons = document.getElementById ('couleurs').children;
const couleurs =[ 'F00', 'B40', '880', '4B0', '0F0', '0B4', '088', '04B', '00F', '40B', '808', 'B04' ];
const couleursId =[ 0, 6, 0, 0 ];

// faire tourner l'aiguille
var angle =0;
var nbRotation =0;
const saut =3;
var tourner = null;

function rotationAnimation(){
	nbRotation +=1;
	angle = angle + saut;
	aiguilles[aiguilleId].setAttributeNS (null, 'transform', 'rotate(' + angle + ',0,0)');
	if (nbRotation >9) nbRotation =0;
	else tourner = requestAnimationFrame (rotationAnimation);
}
function rotation0(){
	couleursId[0] =0;
	echantillons[0].style.backgroundColor = '#'+ couleurs[0];
	echantillons[0].innerHTML = '#'+ couleurs[0];
}
function rotationPremier(){
	couleursId[0] +=1;
	if (couleursId[0] >= couleurs.length) couleursId[0] =0;
	echantillons[0].style.backgroundColor = '#'+ couleurs[couleursId[0]];
	echantillons[0].innerHTML = '#'+ couleurs[couleursId[0]];
}
function rotationSuite (couleurId, ecart0){
	couleursId [couleurId] = couleursId[0] + ecart0;
	if (couleursId [couleurId] >= couleurs.length) couleursId [couleurId] -= couleurs.length;
	echantillons [couleurId].style.backgroundColor = '#'+ couleurs[couleursId [couleurId]];
	echantillons [couleurId].innerHTML = '#'+ couleurs[couleursId [couleurId]];
}
// sélectionner l'aiguille
function selAiguille(){
	angle = parseInt (aiguilles[aiguilleId].getAttributeNS (null, 'transform').slice (7, -1));
	for (var a=0; a<4; a++){
		if (a=== aiguilleId) aiguilles[a].setAttribute ('class', "");
		else aiguilles[a].setAttribute ('class', 'hidden');
}}
function rotationComplementaire (event){
	rotationPremier();
	rotationSuite (1, 6);
	tourner = requestAnimationFrame (rotationAnimation);
}
function selComplementaire(){
	aiguilleId =0;
	selAiguille();
	echantillons[2].className = 'hidden';
	echantillons[3].className = 'hidden';
	rotation0();
	rotationSuite (1, 6);
	aiguilles[0].addEventListener ('mouseover', rotationComplementaire);
}
function rotationTriade (event){
	rotationPremier();
	rotationSuite (1, 4);
	rotationSuite (2, 8);
	tourner = requestAnimationFrame (rotationAnimation);
}
function selTriade(){
	aiguilleId =1;
	selAiguille();
	echantillons[2].className = "";
	echantillons[3].className = 'hidden';
	rotation0();
	rotationSuite (1, 4);
	rotationSuite (2, 8);
	aiguilles[1].addEventListener ('mouseover', rotationTriade);
}
function rotationTriadeBis (event){
	rotationPremier();
	rotationSuite (1, 5);
	rotationSuite (2, 7);
	tourner = requestAnimationFrame (rotationAnimation);
}
function selTriadeBis(){
	aiguilleId =2;
	selAiguille();
	echantillons[2].className = "";
	echantillons[3].className = 'hidden';
	rotation0();
	rotationSuite (1, 5);
	rotationSuite (2, 7);
	aiguilles[2].addEventListener ('mouseover', rotationTriadeBis);
}
function rotationTetrade (event){
	rotationPremier();
	rotationSuite (1, 3);
	rotationSuite (2, 6);
	rotationSuite (3, 9);
	tourner = requestAnimationFrame (rotationAnimation);
}
function selTetrade(){
	aiguilleId =3;
	selAiguille();
	echantillons[2].className = "";
	echantillons[3].className = "";
	rotation0();
	rotationSuite (1, 3);
	rotationSuite (2, 6);
	rotationSuite (3, 9);
	aiguilles[3].addEventListener ('mouseover', rotationTetrade);
}
