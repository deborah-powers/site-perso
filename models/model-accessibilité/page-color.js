// identifier l'aiguille et les couleurs
const aiguilles = document.getElementsByTagName ('polygon');
var aiguilleId =0;
const echantillons = document.getElementById ('couleurs').children;
const couleurs =[ 'F00', 'B40', '880', '4B0', '0F0', '0B4', '088', '04B', '00F', '40B', '808', 'B04' ];
const couleursId =[ 0, 6, 0, 0 ];

// faire tourner l'aiguille
var angle =75;
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
// sélectionner l'aiguille

function rotationComplementaire (event){
	couleursId[0] +=1;
	if (couleursId[0] >= couleurs.length) couleursId[0] =0;
	couleursId[1] = couleursId[0] +6;
	if (couleursId[1] >= couleurs.length) couleursId[1] -= couleurs.length;
	tourner = requestAnimationFrame (rotationAnimation);
	echantillons[0].style.backgroundColor = '#'+ couleurs[couleursId[0]];
	echantillons[0].innerHTML = '#'+ couleurs[couleursId[0]];
	echantillons[1].style.backgroundColor = '#'+ couleurs[couleursId[1]];
	echantillons[1].innerHTML = '#'+ couleurs[couleursId[1]];
}
function selComplementaire(){
	aiguilleId =0;
	for (var a=0; a<4; a++){
		if (a===0) aiguilles[a].setAttribute ('class', "");
		else aiguilles[a].setAttribute ('class', 'hidden');
		echantillons[2].className = 'hidden';
		echantillons[3].className = 'hidden';
	}
	aiguilles[0].addEventListener ('mouseover', rotationComplementaire);
}
function rotationTriade (event){
	couleursId[0] +=1;
	if (couleursId[0] >= couleurs.length) couleursId[0] =0;
	couleursId[1] = couleursId[0] +4;
	if (couleursId[1] >= couleurs.length) couleursId[1] -= couleurs.length;
	couleursId[2] = couleursId[0] +8;
	if (couleursId[2] >= couleurs.length) couleursId[2] -= couleurs.length;
	tourner = requestAnimationFrame (rotationAnimation);
	echantillons[0].style.backgroundColor = '#'+ couleurs[couleursId[0]];
	echantillons[0].innerHTML = '#'+ couleurs[couleursId[0]];
	echantillons[1].style.backgroundColor = '#'+ couleurs[couleursId[1]];
	echantillons[1].innerHTML = '#'+ couleurs[couleursId[1]];
	echantillons[2].style.backgroundColor = '#'+ couleurs[couleursId[2]];
	echantillons[2].innerHTML = '#'+ couleurs[couleursId[2]];
}
function selTriade(){
	aiguilleId =1;
	for (var a=0; a<4; a++){
		if (a===1) aiguilles[a].setAttribute ('class', "");
		else aiguilles[a].setAttribute ('class', 'hidden');
		echantillons[2].className = "";
		echantillons[3].className = 'hidden';
	}
	aiguilles[1].addEventListener ('mouseover', rotationTriade);
}
function selTriadeBis(){
	aiguilleId =2;
	for (var a=0; a<4; a++){
		if (a===2) aiguilles[a].setAttribute ('class', "");
		else aiguilles[a].setAttribute ('class', 'hidden');
		echantillons[2].className = "";
		echantillons[3].className = 'hidden';
	}
	aiguilles[2].addEventListener ('mouseover', rotationAnimation);
}
function selTetrade(){
	aiguilleId =3;
	for (var a=0; a<4; a++){
		if (a===3) aiguilles[a].setAttribute ('class', "");
		else aiguilles[a].setAttribute ('class', 'hidden');
		echantillons[2].className = "";
		echantillons[3].className = "";
	}
	aiguilles[3].addEventListener ('mouseover', rotationAnimation);
}
