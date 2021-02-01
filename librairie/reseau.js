function randomPos (nb){
	var nbRd = nb* Math.random();
	nb =1+ Math.floor (nbRd);
	nb = 100/nb;
	nb = nb+10;
	return nb;
}
matrix =[
	[0,1,3],
	[1,0,2],
	[3,2,0]
];
class Noeud{
	constructor (name, pos){
		this.name ="";
		this.pos =0;
		this.connectionNb =0;
		if (name) this.name = name;
		if (pos) this.pos = pos;
		this.x =10;
		this.y =30;
	}
	connectionNb = function(){
		this.connectionNb =0;
		for (var i=0; i< matrix.length; i++) if (matrix[this.pos][i] >0) this.connectionNb ++;
	}
}
var noeudList =[ new Noeud ('a',0), new Noeud ('b',1), new Noeud ('c',2) ];
for (var n=1; n<3; n++){
	noeudList[n].x = randomPos (matrix[0][noeudList[n].pos]);
	noeudList[n].y = 20+ randomPos (matrix[0][noeudList[n].pos]);
}
// dessiner le graphe
var baseNoeud = document.getElementById ('letter-base');
for (var n=0; n<3; n++){
	var nvNoeud = baseNoeud.copy();
	nvNoeud.lastChild.innerHTML = noeudList[n].name;
	nvNoeud.id = 'noeud-' +n;
	nvNoeud.setAttribute ('transform', 'translate(' + noeudList[n].x +','+ noeudList[n].y +')');
	console.log (nvNoeud);
	svg.appendChild (nvNoeud);
}
