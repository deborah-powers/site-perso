/* dépend de text.js
https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model
var circleList = svg.getElementsByTagNameNS (svgNs, 'circle');
*/
const svgNs = 'http://www.w3.org/2000/svg';
const xlinkNs = 'http://www.w3.org/1999/xlink';
const unitList =[ '%', 'em', 'cm', 'mm', 'px' ];
const unitCurrent = 'em';
var svg = document.getElementsByTagName ('svg')[0];

function createShape (tag, parent, clazz, id){
	var shape = document.createElementNS (svgNs, tag);
	if (clazz) shape.setAttribute ('class', clazz);
	if (parent) parent.appendChild (shape);
	if (id) shape.id = id;
	return shape;
}
SVGGraphicsElement.prototype.copy = function(){
	var parent = null;
	var className = null;
	var id = null;
	if (this.parentNode) parent = this.parent;
	if (this.className) className = this.className;
	if (this.id) id = this.id +'-2';
	var newShape = createShape (this.tagName, parent, className, id);
	var facuAttr =[ 'points', 'd','x','y','cx','cy','rx','ry','r', 'width', 'height', 'transform', 'fill' ];
	for (var a=0; a< facuAttr.length; a++)
		if (this.getAttribute (facuAttr[a])) newShape.setAttribute (facuAttr[a], this.getAttribute (facuAttr[a]));
	if ('gG'.indexOf (this.tagName) >=0) newShape.innerHTML = this.innerHTML;
	return newShape;
}
SVGGraphicsElement.prototype.getAttribute = function (name){
	var attribute = this.getAttributeNS (null, name);
	if (! attribute || attribute == undefined){
		var styles = window.getComputedStyle (this, null);
		attribute = styles[name];
	}
	if (! attribute || attribute == undefined) attribute = null;
	return attribute;
}
SVGGraphicsElement.prototype.getAttributeNbBase = function (name){
	var attributeStr = this.getAttribute (name);
	attributeStr = attributeStr.replace (' ');
	for (var u=0; u< unitList.length; u++) if (attributeStr.contain (unitList[u])) attributeStr = attributeStr.replace (unitList[u]);
	return attributeStr;
}
SVGGraphicsElement.prototype.getAttributeNb = function (name){ return parseInt (this.getAttributeNbBase (name)); }
SVGGraphicsElement.prototype.getAttributeFloat = function (name){
	return parseFloat (this.getAttributeNbBase (name));
}
SVGGraphicsElement.prototype.setAttributeNb = function (name, value){ this.setAttributeNS (null, name, value.toString()); }
SVGGraphicsElement.prototype.setAttribute = function (name, value){ this.setAttributeNS (null, name, value); }

// SVGPolygonElement
SVGPolygonElement.prototype.setPoints = function (pointList){
	if (pointList.constructor.name == 'String') this.setAttribute ('points', pointList);
	else if (pointList.constructor.name == 'Array'){
		for (var p=0; p< pointList.length; p++) pointList[p] = pointList[p][0] +','+ pointList[p][1]
		var pointListStr = pointList.join (' ');
		this.setAttribute ('points', pointListStr);
}}
SVGPolygonElement.prototype.getPoints = function(){
	var pointListStr = this.getAttribute ('points');
	var pointList = pointListStr.split (' ');
	for (var p=0; p< pointList.length; p++){
		pointList[p] = pointList[p].split (',');
		pointList[p][0] = parseFloat (pointList[p][0]);
		pointList[p][1] = parseFloat (pointList[p][1]);
	}
	return pointList;
}
SVGPolylineElement.prototype.setPoints = function (pointList){
	if (pointList.constructor.name == 'String') this.setAttribute ('points', pointList);
	else if (pointList.constructor.name == 'Array'){
		for (var p=0; p< pointList.length; p++) pointList[p] = pointList[p][0] +','+ pointList[p][1]
		var pointListStr = pointList.join (' ');
		this.setAttribute ('points', pointListStr);
}}
SVGPolylineElement.prototype.getPoints = function(){
	var pointListStr = this.getAttribute ('points');
	var pointList = pointListStr.split (' ');
	for (var p=0; p< pointList.length; p++){
		pointList[p] = pointList[p].split (',');
		pointList[p][0] = parseFloat (pointList[p][0]);
		pointList[p][1] = parseFloat (pointList[p][1]);
	}
	return pointList;
}
