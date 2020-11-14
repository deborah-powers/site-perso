// dépend de text.js
const svgNs = 'http://www.w3.org/2000/svg';
const unitList =[ 'em', 'cm', 'mm', 'px' ];
const unitCurrent = 'em';
var svg = document.getElementsByTagName ('svg')[0];

function createShape (tag, parent, clazz, id){
	var shape = document.createElementNS (svgNs, tag);
	if (clazz) shape.className = clazz;
	if (parent) parent.appendChild (shape);
	if (id) shape.id = id;
	return shape;
}
SVGElement.prototype.getAttribute = function (name){ return this.getAttributeNS (null, name); }
SVGElement.prototype.getAttributeNb = function (name){
	var attributeStr = this.getAttribute (name);
	attributeStr = attributeStr.replace (' ');
	for (var u=0; u< unitList.length; u++) if (attributeStr.contain (unitList[u])) attributeStr = attributeStr.slice (0, -2);
	return parseFloat (attributeStr);
}
SVGElement.prototype.setAttributeNb = function (name, value){ this.setAttributeNS (null, name, value + unitCurrent); }
SVGElement.prototype.setAttribute = function (name, value){ this.setAttributeNS (null, name, value); }

// SVGPolygonElement
SVGAnimatedPoints.prototype.setPoints = function (pointList){
	if (pointList.constructor.name == 'String') this.setAttribute ('points', pointList);
	else if (pointList.constructor.name == 'Array'){
		for (var p=0; p< pointList.length; p++) pointList[p] = pointList[p][0] +','+ pointList[p][1]
		var pointListStr = pointList.join (' ');
		this.setAttribute ('points', pointListStr);
}}
SVGAnimatedPoints.prototype.getPoints = function(){
	var pointListStr = this.getAttribute ('points');
	var pointList = pointListStr.split (' ');
	for (var p=0; p< pointList.length; p++){
		pointList[p] = pointList[p].split (',');
		pointList[p][0] = parseFloat (pointList[p][0]);
		pointList[p][1] = parseFloat (pointList[p][1]);
	}
	return pointList;
}
