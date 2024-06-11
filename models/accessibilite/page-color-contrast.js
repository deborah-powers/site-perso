/* le calcul des couleurs utilise la notation (r,v,b)
contraste = luminence col claire / luminence col foncée
luminence (col) = 0.05 + 0.2126 * colR + 0.7152 * colV + 0.0722 * colB
si colXnb <= 10.0164: colX = colXnb / 3294.6
sinon: colX = ((colXnb + 0.055) / 1.055) ^ 2.4
*/
function calculLuminescenceIntermediaire (hueValue){
	if (hueValue <= 10.0164) return hueValue / 3294.6;
	else return ((hueValue /255 + 0.055) / 1.055) ** 2.4;
}
function calculLuminescence (rvb){
	var lum = 0.05;
	lum += 0.2126 * calculLuminescenceIntermediaire (rvb[0]);
	lum += 0.7152 * calculLuminescenceIntermediaire (rvb[1]);
	lum += 0.0722 * calculLuminescenceIntermediaire (rvb[2]);
	return lum;
}
function calculRatioLuminescence (rvbLigth, rvbDark){
	const lumLigth = calculLuminescence (rvbLigth);
	const lumDark = calculLuminescence (rvbDark);
	var lumRatio =1;
	if (lumLigth > lumDark) lumRatio = lumLigth / lumDark;
	else lumRatio = lumDark / lumLigth;
	return lumRatio;
}
function hexaToRvb (couleurHexa){
	if (couleurHexa[0] === '#') couleurHexa = couleurHexa.slice (1);
	couleurHexa = couleurHexa.toUpperCase();
	const hexaToRvbCorrespondance = '0123456789ABCDEF';
	var rvb = [0,0,0];
	// si la couleur est codée sur trois caractères
	if (couleurHexa.length <5){
		rvb[0] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[0]);
		rvb[1] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[1]);
		rvb[2] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[2]);
	}
	// si la couleur est codée sur six caractères
	else if (couleurHexa.length <9){
		rvb[0] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[0]);
		rvb[1] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[2]);
		rvb[2] = 17* hexaToRvbCorrespondance.indexOf (couleurHexa[4]);
	}
	return rvb;
}
var couleurA = '#000';
var couleurB = '#000';
function showColor (input){
	if (input.name === 'couleur-fond') couleurA = input.value;
	else couleurB = input.value;
	const rvbA = hexaToRvb (couleurA);
	const rvbB = hexaToRvb (couleurB);
	const lumRatio = calculRatioLuminescence (rvbA, rvbB);
	const resTag = document.getElementsByTagName ('form')[0].getElementsByTagName ('p')[0];
	if (lumRatio <3) resTag.innerHTML = 'le constraste est trop bas pour passer le niveau AA';
	else if (lumRatio <4.5) resTag.innerHTML = 'le constraste passe le niveau AA pour les gros caractères';
	else if (lumRatio >=7) resTag.innerHTML = 'le constraste est parfait';
	else resTag.innerHTML = 'le constraste passe le niveau AA';
}
function rvbAdd (valueStart){
	valueStart +=10;
	if (valueStart >255) valueStart =255;
	return valueStart;
}
function rvbSup (valueStart){
	valueStart -=10;
	if (valueStart <0) valueStart =0;
	return valueStart;
}
Array.prototype.isExtreme = function(){
	var extreme = false;
	if (this[0] ===255 && this[1] ===255 && this[2] ===255) extreme = true;
	else if (this[0] ===0 && this[1] ===0 && this[2] ===0) extreme = true;
	return extreme;
}
function proposeColor (input){
	const rvbA = hexaToRvb (input.value);
	const lumA = calculLuminescence (rvbA);
	var rvbB = [ 255- rvbA[0], 255- rvbA[1], 255- rvbA[2] ];
	var lumRatio = calculRatioLuminescence (rvbA, rvbB);
	while (lumRatio <4.5 && ! rvbB.isExtreme()){
		if (lumA <0.2){
			rvbB[0] = rvbAdd (rvbB[0]);
			rvbB[1] = rvbAdd (rvbB[1]);
			rvbB[2] = rvbAdd (rvbB[2]);
		} else {
			rvbB[0] = rvbSup (rvbB[0]);
			rvbB[1] = rvbSup (rvbB[1]);
			rvbB[2] = rvbSup (rvbB[2]);
		}
		lumRatio = calculRatioLuminescence (rvbA, rvbB);
	}
	const resTag = document.getElementsByTagName ('form')[0].getElementsByTagName ('span')[1];
	const lumB = calculLuminescence (rvbB);
	resTag.style.backgroundColor = 'rgb(' + rvbB.join (',') +')';
	resTag.innerHTML = 'rgb(' + rvbB.join (',') +')';
	if (lumB <0.2) resTag.style.color = 'var(--page-color)';
	else resTag.style.color = 'var(--text-color)';
}