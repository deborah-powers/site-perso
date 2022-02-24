/* origine du code http://www.petercollingridge.co.uk/book/export/html/524
dépend de svg.js
utilisation
obj { cursor: move; }
<obj onmousedown='selectElement(evt)'/>

var styles = window.getComputedStyle (document.getElementsByTagName ('svg')[0], null);
for (var s=0; s< styles.length; s++) if (styles.hasOwnProperty (styles[s])) console.log (styles[s], styles[styles[s]]);
*/
const svgWidth = svg.getAttributeNb ('width');
const svgHeight = svg.getAttributeNb ('height');
var currentX =0;
var currentY =0;

function selectElement (evt){
	currentX = evt.clientX;
	currentY = evt.clientY;
//	console.log (evt.target.tagName);
	if (! evt.target.limit || evt.target.limit == undefined) evt.target.getDragLimit();
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
	if (dx > this.limit.maxX) dx= this.limit.maxX;
	else if (dx < this.limit.minX) dx= this.limit.minX;
	if (dy > this.limit.maxY) dy= this.limit.maxY;
	else if (dy < this.limit.minY) dy= this.limit.minY;
	this.setAttribute (nameX, dx);
	this.setAttribute (nameY, dy);
}
SVGGeometryElement.prototype.dragToucheBord = function (dx, dy){
	var toucheBord = false;
	if (dx > this.limit.maxX){
		toucheBord = true;
		dx= this.limit.maxX;
	}
	else if (dx < this.limit.minX){
		toucheBord = true;
		dx= this.limit.minX;
	}
	if (dy > this.limit.maxY){
		toucheBord = true;
		dy= this.limit.maxY;
	}
	else if (dy < this.limit.minY){
		toucheBord = true;
		dy= this.limit.minY;
	}
	if (toucheBord) deselectElement (this);
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
SVGGeometryElement.prototype.getDragLimit = function (minX, minY, maxX, maxY){
	if (! minX || minX == undefined) minX =0;
	if (! minY || minY == undefined) minY =0;
	if (! maxX || maxX == undefined) maxX = svgWidth;
	if (! maxY || maxY == undefined) maxY = svgHeight;
	this.limit ={ minX: minX, minY: minY, maxX: maxX, maxY: maxY };
	this.getDragLimitShape();
}
SVGRectElement.prototype.getDragLimitShape = function(){
	var rNbr = this.getAttributeNb ('width');
	this.limit.maxX -= rNbr;
	rNbr = this.getAttributeNb ('height');
	this.limit.maxY -= rNbr;
}
SVGEllipseElement.prototype.getDragLimitShape = function(){
	var rNbr = this.getAttributeNb ('rx');
	this.limit.minX += rNbr;
	this.limit.maxX -= rNbr;
	rNbr = this.getAttributeNb ('ry');
	this.limit.minY += rNbr;
	this.limit.maxY -= rNbr;
}
SVGCircleElement.prototype.getDragLimitShape = function(){
	var rNbr = this.getAttributeNb ('r');
	this.limit.minX += rNbr;
	this.limit.maxX -= rNbr;
	this.limit.minY += rNbr;
	this.limit.maxY -= rNbr;
}