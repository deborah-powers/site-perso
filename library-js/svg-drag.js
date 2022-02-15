/* origine du code http://www.petercollingridge.co.uk/book/export/html/524
dépend de svg.js
utilisation
obj { cursor: move; }
<obj onmousedown='selectElement(evt)'/>

var styles = window.getComputedStyle (document.getElementsByTagName ('svg')[0], null);
for (var s=0; s< styles.length; s++) if (styles.hasOwnProperty (styles[s])) console.log (styles[s], styles[styles[s]]);
*/

var currentX =0;
var currentY =0;

function selectElement (evt){
	currentX = evt.clientX;
	currentY = evt.clientY;
	console.log (evt.target.tagName);
	evt.target.setAttributeNS (null, 'onmousemove', 'moveElement(evt)');
	evt.target.setAttributeNS (null, 'onmouseup', 'deselectElement(evt.target)');
}
function deselectElement (target){
	target.removeAttributeNS (null, 'onmousemove');
	target.removeAttributeNS (null, 'onmouseup');
}
function moveElement (evt){
	var dx= evt.clientX - currentX;
	var dy= evt.clientY - currentY;
	currentX = evt.clientX;
	currentY = evt.clientY;
	evt.target.drag (dx, dy);
}
SVGGeometryElement.prototype.drag = function (dx, dy){
	var nameX = 'x';
	var nameY = 'y';
	if (this.tagName == 'circle' || this.tagName == 'ellipse'){ nameX = 'cx'; nameY = 'cy'; }
	dx= parseInt (this.getAttribute (nameX)) +dx;
	dy= parseInt (this.getAttribute (nameY)) +dy;
	this.setAttribute (nameX, dx);
	this.setAttribute (nameY, dy);
}
SVGLineElement.prototype.drag = function (dx, dy){
	var nb= dx+ parseInt (this.getAttribute ('x1'));
	this.setAttribute ('x1', nb);
	nb= dx+ parseInt (this.getAttribute ('x2'));
	this.setAttribute ('x2', nb);
	nb= dy+ parseInt (this.getAttribute ('y1'));
	this.setAttribute ('y1', nb);
	nb= dy+ parseInt (this.getAttribute ('y2'));
	this.setAttribute ('y2', nb);
}
SVGPolygonElement.prototype.drag = function (dx, dy){
	var pointList = this.getPoints();
	for (var p=0; p< pointList.length; p++){
		pointList[p][0] +=dx;
		pointList[p][1] +=dy;
	}
	this.setPoints (pointList);
}
SVGPolylineElement.prototype.drag = function (dx, dy){
	var pointList = this.getPoints();
	for (var p=0; p< pointList.length; p++){
		pointList[p][0] +=dx;
		pointList[p][1] +=dy;
	}
	this.setPoints (pointList);
}