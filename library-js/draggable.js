/*
dépendences: func-obj.js
classe permettant de déplacer un élément à la souris.
utilisation d'une classe css draggable.

utilisation:
	récupérer l'objet (obj = document.getElementById ('...')
	var dragdrop = new Draggable (obj, moveParent =true)

les arguments:
	obj: l'objet sur lequel je clique
	moveParent: false si je veux déplacer obj, true si c'est l'en-tête de l'objet à déplacer
*/
class Draggable{
	constructor (objTarget, moveParent=true){
		this.posMouseX =10;
		this.posMouseY =10;
		this.widowX = window.outerWidth;
		this.widowY = window.outerHeight;
		this.target = objTarget;
		this.movable = objTarget;
		if (moveParent) this.movable = objTarget.parentElement;
		this.movable.className = 'draggable';
		var self = this;
		this.target.onmousedown = function (evt){ self.init (self, evt); };
		this.target.onmouseup = function(){ self.stop (self); };
	}
	init = function (self, evt){
		self.posMouseX = evt.clientX;
		self.posMouseY = evt.clientY;
		evt.target.onmousemove = function (evt){ self.change (self, evt); };
	}
	change = function (self, evt){
		var offsetMouseX = self.movable.offsetLeft - self.posMouseX + evt.clientX;
		var offsetMouseY = self.movable.offsetTop - self.posMouseY + evt.clientY;
		if (offsetMouseX <0) offsetMouseX =0;
		if (offsetMouseY <0) offsetMouseY =0;
		var maxX = self.widowX - self.movable.offsetWidth;
		var maxY = self.widowY - self.movable.offsetHeight;
		if (offsetMouseX > maxX) offsetMouseX = maxX;
		if (offsetMouseY > maxY) offsetMouseY = maxY;
		self.movable.style.left = offsetMouseX +'px';
		self.movable.style.top = offsetMouseY +'px';
		self.posMouseX = evt.clientX;
		self.posMouseY = evt.clientY;
	}
	stop = function (self){
		self.target.onmousemove =null;
	}
}