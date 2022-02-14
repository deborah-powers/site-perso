/* afficher un réseau de point dans une image svg
var nomsPoints =[ 'a', 'b', 'c', 'd', 'e' ];
var relationsPoints =[
	[0],
	[1,0],
	[0,1,0],
	[0,1,0,0],
	[0,0,0,1,0]
];
creerGraphe (nomsPoints, relationsPoints);
racine (2) = 1.414213562
*/
const svgWidth = svg.getAttributeNb ('width') /10;
const svgHeight = svg.getAttributeNb ('height') /10;
var pointsListe =[];
var freresListe =[];

function creerGraphe (nomsPoints, relationsPoints){
	var point = randomPoint10();
	pointsListe.push (point);

	for (var l=1; l< nomsPoints.length; l++){
		freresListe =[];
		for (var m=0; m<l; m++) if (relationsPoints[l][m] >0) freresListe.push (m);
		if (freresListe.length >0){
			point = randomPointRef (pointsListe[freresListe[0]][0], pointsListe[freresListe[0]][1]);
			for (var m=0; m< freresListe.length; m++){
				if (relationsPoints[l][freresListe[m]] >1) dessinerLigne (point[0], point[1], pointsListe[freresListe[m]][0], pointsListe[freresListe[m]][1], true);
				else dessinerLigne (point[0], point[1], pointsListe[freresListe[m]][0], pointsListe[freresListe[m]][1]);
			}
		}
		else point = randomPoint10();
		pointsListe.push (point);
	}
	for (var l=0; l< nomsPoints.length; l++) dessinerNoeud (nomsPoints[l], pointsListe[l][0], pointsListe[l][1]);
}
function pointsListeContien (posX, posY){
	var poContain = false;
	for (var p=0; p< pointsListe.length; p++) if (pointsListe[p][0] == posX && pointsListe[p][1] == posY) poContain = true;
	return poContain;
}
function randomNb10(){
	var pos =0;
	while (pos <=0 || pos >=10){
		pos = 10* Math.random();
		pos = Math.floor (pos);
	}
	return pos;
}
function randomPoint10(){
	var posX = randomNb10();
	var posY = randomNb10();
	while (pointsListeContien (posX, posY)){
		posX = randomNb10();
		posY = randomNb10();
	}
	return [ posX, posY ];
}
function randomNbRef (ref){
	var pos =0;
	while (pos <=0 || pos >=10 || pos < ref -1 || pos > ref +1){
		pos = 3* Math.random();
		pos = Math.floor (pos);
		pos -=1;
		pos += ref;
	}
	return pos;
}
function randomPointRef (refX, refY){
	var posX = randomNbRef (refX);
	var posY = randomNbRef (refY);
	while (pointsListeContien (posX, posY)){
		posX = randomNbRef (refX);
		posY = randomNbRef (refY);
	}
	return [posX, posY];
}
function dessinerLigne (posX, posY, posX2, posY2, double){
	posX = svgWidth * posX -1;
	posY = svgHeight * posY -1;
	posX2 = svgWidth * posX2 -1;
	posY2 = svgHeight * posY2 -1;
	var newLine = createShape ('line', svg);
	if (double) newLine.setAttribute ('class', 'double');
	newLine.setAttributeNb ('x1', posX);
	newLine.setAttributeNb ('y1', posY);
	newLine.setAttributeNb ('x2', posX2);
	newLine.setAttributeNb ('y2', posY2);
}
function dessinerNoeud (letter, posX, posY){
	posX = svgWidth * posX -1;
	posY = svgHeight * posY -1;
	var newCircle = createShape ('circle', svg);
	newCircle.setAttributeNb ('cx', posX);
	newCircle.setAttributeNb ('cy', posY);
	var newText = createShape ('text', svg);
	newText.setAttributeNb ('x', posX);
	newText.setAttributeNb ('y', posY);
	newText.innerHTML = letter;
}
