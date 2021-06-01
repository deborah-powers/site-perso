/*
créer des formes svg avec js.
*/
const svgNs = 'http://www.w3.org/2000/svg';

class Shape{
	constructor (type, posX, posY, width, height, color, borderColor, id, clazz, borderWidth){
		this.type = 'cicle';		if (type) this.type = type;
		this.id = null;		if (id) this.id = id;
		this.class = null;	if (clazz) this.class = clazz;
		this.centerX = 0;	if (posX) this.centerX = posX;
		this.centerY = 0;	if (posY) this.centerY = posY;
		this.width = 1;		if (width) this.width = width;
		this.height = 1;	if (height) this.height = height;
		this.color = null;	if (color) this.color = color;
		this.borderColor = null;	if (borderColor) this.borderColor = borderColor;
		this.borderWidth = null;	if (borderWidth) this.borderWidth = borderWidth;
		this.object = document.createElementNS (svgNs, this.type);
		this.toObjAttr();
	}
	translate = function (x,y){
		if (!y) y=x;
		this.centerX +=x;
		this.centerY +=y;
	}
	scale = function (x,y){
		if (!y) y=x;
		this.width *=x;
		this.height *=y;
	}
	toObjAttr = function(){
	//	this.object = document.createElementNS (svgNs, this.type);
		if (this.class) this.object.setAttributeNS (null, 'class', this.class);
		if (this.id) this.object.setAttributeNS (null, 'id', this.id);
		if (this.color) this.object.setAttributeNS (null, 'fill', this.color);
		if (this.borderColor) this.object.setAttributeNS (null, 'stroke', this.borderColor);
		if (this.borderWidth) this.object.setAttributeNS (null, 'stroke-width', this.borderWidth);
	}
	toSvg = function (svgObj){
		this.toObj();
		svgObj.appendChild (this.object);
	}
}
class Circle extends Shape{
	constructor (posX, posY, width, color, borderColor, id, clazz, borderWidth){
		super ('circle', posX, posY, width, width, color, borderColor, id, clazz, borderWidth);
		this.toObj();
	}
	toObj = function(){
		this.toObjAttr();
		this.object.setAttributeNS (null, 'cx', this.centerX);
		this.object.setAttributeNS (null, 'cy', this.centerY);
		this.object.setAttributeNS (null, 'r', this.width /2);
	}
}
class Ellipse extends Shape{
	constructor (posX, posY, width, height, color, borderColor, id, clazz, borderWidth){
		super ('ellipse', posX, posY, width, height, color, borderColor, id, clazz, borderWidth);
		this.toObj();
	}
	toObj = function(){
		this.toObjAttr();
		this.object.setAttributeNS (null, 'cx', this.centerX);
		this.object.setAttributeNS (null, 'cy', this.centerY);
		this.object.setAttributeNS (null, 'rx', this.width /2);
		this.object.setAttributeNS (null, 'ry', this.height /2);
	}
}
class Rectangle extends Shape{
	constructor (posX, posY, width, height, color, borderColor, id, clazz, borderWidth){
		super ('rect', posX, posY, width, height, color, borderColor, id, clazz, borderWidth);
		this.toObj();
	}
	toObj = function(){
		var centX = this.centerX - this.width /2;
		var centY = this.centerY - this.height /2;
		this.toObjAttr();
		this.object.setAttributeNS (null, 'x', centX);
		this.object.setAttributeNS (null, 'y', centY);
		this.object.setAttributeNS (null, 'width', this.width);
		this.object.setAttributeNS (null, 'height', this.height);
	}
}
class Group extends Shape{
	constructor (posX, posY, width, height, color, borderColor, id, clazz, borderWidth){
		super ('g', posX, posY, width, height, color, borderColor, id, clazz, borderWidth);
		this.toObj();
	}
}
class Square extends Rectangle{
	constructor (posX, posY, width, color, borderColor, id, clazz, borderWidth){
		super (posX, posY, width, width, color, borderColor, id, clazz, borderWidth);
	}
}
class Polygon extends Shape{
	constructor (posX, posY, width, height, pointList, color, borderColor, id, clazz, borderWidth){
		// pointList =[ [x,y], [x,y] ]. x et y sont compris entre 0 et 100.
		super ('polygon', posX, posY, width, height, color, borderColor, id, clazz, borderWidth);
		this.points =[];
		this.fromPoints (pointList);
		this.width = width; this.height = height;
		this.centerX = posX; this.centerY = posY;
		this.toObj();
	}
	fromPoints = function (pointList){
		// pointList =[ [x,y], [x,y] ]
		if (! pointList) return;
		this.width = pointList[0][0];
		this.height = pointList[0][1];
		this.centerX = pointList[0][0];
		this.centerY = pointList[0][1];
		for (var p in pointList){
			if (pointList[p][0] < this.centerX) this.centerX = pointList[p][0];
			else if (pointList[p][0] > this.width) this.width = pointList[p][0];
			if (pointList[p][1] < this.centerY) this.centerY = pointList[p][1];
			else if (pointList[p][1] > this.height) this.height = pointList[p][1];
		}
		this.width -= this.centerX;
		this.height -= this.centerY;
		for (var p in pointList){
			pointList[p][0] -= this.centerX;
			pointList[p][0] *=100;
			pointList[p][0] /= this.width;
			pointList[p][1] -= this.centerY;
			pointList[p][1] *=100;
			pointList[p][1] /= this.height;
			this.points.push (pointList[p]);
		}
		this.centerX += this.width /2;
		this.centerY += this.height /2;
	}
	toPoints = function(){
		var centerX = this.centerX - this.width /2;
		var centerY = this.centerY - this.height /2;
		var txtPoints ="";
		var x=0, y=0;
		for (var p in this.points){
			x= this.points[p][0] * this.width;
			x /=100;
			x += centerX;
			y= this.points[p][1] * this.height;
			y /=100;
			y += centerY;
			if (!x) x= '0'; if (!y) y= '0';
			txtPoints = txtPoints + ' '+ x +','+ y;
		}
		txtPoints = txtPoints.slice (1);
		return txtPoints;
	}
	toObj = function(){
		this.toObjAttr();
		var txtPoints = this.toPoints();
		this.object.setAttributeNS (null, 'points', txtPoints);
	}
}
class Triangle extends Polygon{
	constructor (posX, posY, width, height, color, borderColor, id, clazz, borderWidth){
		var pointList =[[0,0], [50,0], [25,43.3]];
		super (posX, posY, width, height, pointList, color, borderColor, id, clazz, borderWidth);
	}
}
class Path extends Shape{
	// que des valeurs relatives
	constructor (posX, posY, width, height, pointList, color, borderColor, id, clazz, borderWidth){
		super ('path', posX, posY, width, height, color, borderColor, id, clazz, borderWidth);
		this.points =[];
		this.fromPoints (pointList);
		this.width = width; this.height = height;
		this.centerX = posX; this.centerY = posY;
		this.toObj();
	}
	fromPoints = function (pointList){
		// pointList =[ [x,y], [x,y], [x,y] ]
		if (! pointList || pointList.length %3) return;
		var width = pointList[2][0];
		var height = pointList[2][1];
		for (var p in pointList){
			if (p%3 ===2){
				if (pointList[p][0] < this.centerX) this.centerX = pointList[p][0];
				else if (pointList[p][0] > width) width = pointList[p][0];
				if (pointList[p][1] < this.centerY) this.centerY = pointList[p][1];
				else if (pointList[p][1] > height) height = pointList[p][1];
		}}
		for (var p in pointList){
			if (p%3 ===2){
				pointList[p][0] *=100;
				pointList[p][0] /= width;
				pointList[p][1] *=100;
				pointList[p][1] /= height;
			}
			this.points.push (pointList[p]);
		}
		this.centerX += this.width /2;
		this.centerY += this.height /2;
	}
	toPoints = function (){
		var txtPoints ="";
		var x=0, y=0;
		for (var p in this.points){
			x= this.points[p][0]; y= this.points[p][1];
			 if (p%3 ===2){
				x= this.points[p][0] * this.width;
				x /=100;
				y= this.points[p][1] * this.height;
				y /=100;
			}
			if (!x) x= '0';	if (!y) y= '0';
			if (p%3 <1) txtPoints = txtPoints + ' c';
			txtPoints = txtPoints + ' '+ x +','+ y;
		}
		x= this.width /2;
		x= this.centerX -x;
		y= this.height /2;
		y= this.centerY -y;
		txtPoints = 'm '+ x +','+ y + txtPoints;
		return txtPoints;
	}
	toObj = function(){
		this.toObjAttr();
		var txtPoints = this.toPoints();
		this.object.setAttributeNS (null, 'd', txtPoints);
	}
}
class Pattern extends Shape{
	constructor (id, width, height, color, borderColor, borderWidth){
		super ('pattern', 0,0, width, height, color, borderColor, id, null, borderWidth);
		this.toObjAttr();
		this.object.setAttributeNS (null, 'x', 0);
		this.object.setAttributeNS (null, 'y', 0);
		this.object.setAttributeNS (null, 'width', this.width);
		this.object.setAttributeNS (null, 'height', this.height);
		this.type = 'absolu';
		if (this.width <=1){
			this.type = 'proportionnel';
			this.object.setAttributeNS (null, 'patternUnits', 'userSpaceOnUse');
		}
	}
	addObj = function (obj){ this.object.innerHTML = this.object.innerHTML + obj.outerHTML; }
	addShape = function (shape){ this.object.innerHTML = this.object.innerHTML + shape.object.outerHTML; }
	toSvg = function (defsObj){ defsObj.appendChild (this.object); }
	toShape = function (shape){
		shape.color = 'url(#' + this.id +')';
		shape.toObj();
	}
}
class Gradient extends Shape{
	constructor (id, colorList, offsetList, type, endX, endY, startX, startY){
		super (type + 'Gradient', startX, startY, endX, endY, null, null, id);
		this.type = 'linear'; if (type) this.type = type;
		this.centerX =20; if (startX) this.centerX = startX;
		this.centerY =20; if (startY) this.centerY = startY;
		this.width =100; if (endX) this.width = endX;
		this.height =100; if (endY) this.height = endY;
		if (! offsetList) offsetList =[];
		offsetList.unshift (0);
		offsetList.push (100)
		this.offsets = offsetList;
		this.colors = colorList;
		if (this.type === 'linear'){
			this.object.setAttributeNS (null, 'x1', this.centerX +'%');
			this.object.setAttributeNS (null, 'y1', this.centerY +'%');
			this.object.setAttributeNS (null, 'x2', this.width +'%');
			this.object.setAttributeNS (null, 'y2', this.height +'%');
		} else {
			this.object.setAttributeNS (null, 'cx', this.centerX +'%');
			this.object.setAttributeNS (null, 'cy', this.centerY +'%');
			this.object.setAttributeNS (null, 'r', this.width +'%');
		}
		this.createStops();
	}
	createStops = function(){
		var stop =null;
		for (var c in this.colors){
			stop = document.createElementNS (svgNs, 'stop');
			stop.setAttributeNS (null, 'offset', this.offsets[c] +'%');
			stop.setAttributeNS (null, 'stop-color', this.colors[c]);
			this.object.appendChild (stop);
		}
	}
	toSvg = function (defsObj){ defsObj.appendChild (this.object); }
	toShape = function (shape){
		shape.color = 'url(#' + this.id +')';
		shape.toObj();
	}
}