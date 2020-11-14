/*
animer des formes svg avec js.
dépendence: svg-shape.js
*/
class Animation {
	constructor (shape, event){
		this.shape = shape;
		this.event = event;
		this.func = null;
	}
	setFunc = function (funcChange){
		this.func = funcChange;
		var self = this;
		if (this.event === 'over') this.shape.object.onmouseover = function (evt){ funcChange (self, evt); }
		else if (this.event === 'down') this.shape.object.onmousedown = function (evt){ funcChange (self, evt); }
		else if (this.event === 'click') this.shape.object.onclick = function (evt){ funcChange (self, evt); }
	}
}
class ColorShape extends Animation{
	constructor (shape, colorList){
		super (shape, 'over');
		this.colors = colorList;
		this.setFunc (this.changeCol);
	}
	changeCol = function (self, evt){
		const oldColor = self.shape.color;
		var pos = self.colors.indexOf (oldColor);
		pos +=1;
		if (pos >= self.colors.length) pos =0;
		self.shape.color = self.colors[pos];
		self.shape.toObj();
	}
}
class DragShape extends Animation{
	constructor (shape){
		super (shape, 'down');
		this.posMouseX =10;
		this.posMouseY =10;
		this.windowX = window.outerWidth;
		this.windowY = window.outerHeight;
		this.setFunc (this.init);
		var self = this;
		this.shape.object.onmouseup = function(){ self.stop (self); };
	}
	init = function (self, evt){
		self.posMouseX = evt.clientX;
		self.posMouseY = evt.clientY;
		evt.target.onmousemove = function (evt){ self.move (self, evt); };
	}
	move = function (self, evt){
		var offsetMouseX = self.shape.centerX - self.posMouseX + evt.clientX;
		var offsetMouseY = self.shape.centerY - self.posMouseY + evt.clientY;
		if (offsetMouseX <0) offsetMouseX =0;
		if (offsetMouseY <0) offsetMouseY =0;
		if (offsetMouseX > self.windowX) offsetMouseX = self.windowX - self.shape.centerX /2;
		if (offsetMouseY > self.windowY) offsetMouseY = self.windowY - self.shape.centerY /2;
		self.posMouseX = evt.clientX;
		self.posMouseY = evt.clientY;
		self.shape.centerX = self.posMouseX;
		self.shape.centerY = self.posMouseY;
		self.shape.toObj();
	}
	stop = function (self){ self.shape.object.onmousemove =null; }
}