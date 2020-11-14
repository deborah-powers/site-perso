/*
créer des formes svg avec js.
dépendences:
	svg-shape.js
	svg-animation.js
*/
var svg = document.getElementsByTagName ('svg')[0];
if (! svg){
	console.log ("pas d'objet svg");
	alert ("pas d'objet svg");
	return;
}
svg.style.border = 'dotted 4px brown';
var rec = new Rectangle (30,30,40,30, 'cadetblue', null, 'demo-rectangle');
var cer = new Circle (70,30,30, 'purple', null, 'demo-circle');
var ell = new Ellipse (120,30,60,80, 'seagreen', null, 'demo-ellipse');
var tri = new Triangle (170,30,30,30, 'deeppink', null, 'demo-polygon');
var pth = new Path (210,30,40,20, [[0,20], [20,20], [20,0]], 'orange', 'brown', 'demo-path', null, '1mm');
var defs = document.getElementsByTagName ('defs')[0];
if (! defs){
	defs = document.createElementNS (svgNs, null, 'defs');
	svg.appendChild (defs);
}
var grd = new Gradient ('demo-gradient', ['cadetblue', 'orange', 'violet'], [60], 'radial');
grd.toSvg (defs);
grd.toShape (cer);
var cerPtn = new Circle (5,5,6);
var ptnRel = new Pattern ('demo-pattern-rel', 0.2,0.2, 'seagreen');
ptnRel.addObj (cerPtn.object);
ptnRel.toSvg (defs);
ptnRel.toShape (ell);
var ptnAbs = new Pattern ('demo-pattern-abs', 5,5, 'deeppink');
ptnAbs.addObj (cerPtn.object);
ptnAbs.toSvg (defs);
ptnAbs.toShape (rec);
console.log ('abs', ptnAbs.object);
console.log ('rel', ptnRel.object);
rec.toSvg (svg);
cer.toSvg (svg);
ell.toSvg (svg);
tri.toSvg (svg);
pth.toSvg (svg);
var col = new ColorShape (tri, ['cadetblue', 'orange', 'violet']);
var draTri = new DragShape (tri);
var draPth = new DragShape (pth);
