/* p {
	cursor: move;
	position: absolute;
	width: 60px;
	height: 60px;
}
parentElement.isContainer();
<p class='auto'></p>
<p class='drag'></p>
*/
var currentX =0;
var currentY =0;
var boundaries =[];

HTMLElement.prototype.isContainer = function(){
	this.setBoundaries();
	for (var i=0; i< this.children.length; i++){
		if (this.children[i].className.includes ('drag')) this.children[i].addEventListener ('mousedown', dragSelect);
		else if (this.children[i].className.includes ('auto')) for (var n=0; n< 10; n++) this.children[i].autoMove();
	//	else if (this.children[i].className.includes ('auto')) this.children[i].addEventListener ('mousedown', autoMove);
}}

/* ------------------------ drag-drop ------------------------ */

function dragSelect (event){
	currentX = event.screenX;
	currentY = event.screenY;
	event.target.setAttribute ('onmousemove', 'dragMove(this)');
	event.target.setAttribute ('onmouseup', 'dragDrop(this)');
	event.target.setAttribute ('onmouseout', 'dragDrop(this)');
}
function dragDrop (paragraph){
	paragraph.removeAttribute ('onmousemove');
	paragraph.removeAttribute ('onmouseup');
	paragraph.removeAttribute ('onmouseout');
}
function dragMove (paragraph){
	var dx= event.screenX - currentX;
	var dy= event.screenY - currentY;
	paragraph.move (dx, dy);
	currentX = event.screenX;
	currentY = event.screenY;
}
/* ------------------------ déplacement autonome ------------------------ */

HTMLElement.prototype.autoMove = function(){
	var dx = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0])) - this.offsetLeft;
	var dy = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]) - this.offsetTop;
	console.log (dx, this.offsetLeft, dy, this.offsetTop);
	dx= dx /60;
	dy= dy /60;
	var secNb = 0;
	var self = this;
	function animate(){
		secNb +=1;
		self.move (dx,dy);
		if (secNb <60) requestAnimationFrame (animate);
	}
	animate();
}
function autoMove (event){
	var dx = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0])) - event.target.offsetLeft;
	var dy = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]) - event.target.offsetTop;
	const secMax = Math.abs (dx);
	dy = dy / secMax;
	if (dx <0) dx =-1;
	else if (dx >0) dx =1;
	var secNb = 0;
	function animate(){
		secNb +=1;
		event.target.move (dx, dy);
		if (secNb < secMax) requestAnimationFrame (animate);
	}
	animate();
}
function autoMove_va (event){
	var dx = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0])) - event.target.offsetLeft;
	var dy = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]) - event.target.offsetTop;
	dx= dx /60;
	dy= dy /60;
	let secNb = 0;
	function animate(){
		secNb +=1;
		event.target.move (dx,dy);
		if (secNb <60) requestAnimationFrame (animate);
	}
	animate();
}
/* ------------------------ fonctions communes ------------------------ */

HTMLElement.prototype.move = function (dx, dy){
	dx = this.offsetLeft + dx;
	dy = this.offsetTop + dy;
	var pos = this.senseObstacle (dx, dy);
	pos = this.senseBoundaries (pos[0], pos[1]);
	this.style.left = pos[0] + 'px';
	this.style.top = pos[1] + 'px';
	this.style.animationName = 'moving-heart';
}
String.prototype.fromPxToNb = function(){
	// nbStr = 12px
	const nbStr = this.slice (0, -2);
	var nbInt = parseInt (nbStr);
	return nbInt;
}
HTMLElement.prototype.setBoundaries = function(){
	const style = window.getComputedStyle (this);
	var x1=0;
	if (this.clientLeft > x1) x1= this.clientLeft;
	var tmp = style.left.fromPxToNb();
	if (tmp >x1) x1= tmp;
	tmp = style.marginLeft.fromPxToNb();
	if (tmp >x1) x1= tmp;
	const x2= x1+ this.clientWidth - style.paddingRight.fromPxToNb();
	x1= x1+ style.paddingLeft.fromPxToNb();
	var y1=0;
	if (this.clientTop > y1) y1= this.clientTop;
	var tmp = style.top.fromPxToNb();
	if (tmp >y1) y1= tmp;
	tmp = style.marginTop.fromPxToNb();
	if (tmp >y1) y1= tmp;
	const y2= y1+ this.clientHeight - style.paddingBottom.fromPxToNb();
	y1= y1+ style.paddingTop.fromPxToNb();
	boundaries = [ x1, y1, x2, y2 ];
}
HTMLElement.prototype.senseBoundaries = function (posX, posY){
	if (boundaries !== null && boundaries !== undefined && boundaries.length ===4){
		if (posX < boundaries[0]) posX = boundaries[0];
		else if (posX + this.clientWidth > boundaries[2]) posX = boundaries[2] - this.clientWidth;
		if (posY < boundaries[1]) posY = boundaries[1];
		else if (posY + this.clientHeight > boundaries[3]) posY = boundaries[3] - this.clientHeight;
	}
	return [ posX, posY ];
}
HTMLElement.prototype.senseObstacle = function (posX, posY){
	for (var c=0; c< this.parentElement.children.length; c++){
		if (this.parentElement.children[c] !== this){
			if (posX < this.parentElement.children[c].offsetLeft && this.parentElement.children[c].offsetLeft < posX + this.clientWidth){
				const dx = this.clientWidth + posX - this.parentElement.children[c].offsetLeft;
				if (posY < this.parentElement.children[c].offsetTop && this.parentElement.children[c].offsetTop < posY + this.clientHeight){
					const dy= this.clientHeight + posY - this.parentElement.children[c].offsetTop;
					if (dx > dy) posY = this.parentElement.children[c].offsetTop - this.clientHeight;
					else posX = this.parentElement.children[c].offsetLeft - this.clientWidth;
				}
				else if (posY < this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight && this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight < posY + this.clientHeight){
					const dy= this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight - posY;
					if (dx > dy) posY = this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight;
					else posX = this.parentElement.children[c].offsetLeft - this.clientWidth;
			}}
			else if (posX < this.parentElement.children[c].offsetLeft + this.parentElement.children[c].clientWidth && this.parentElement.children[c].offsetLeft + this.parentElement.children[c].clientWidth < posX + this.clientWidth){
				const dx = this.parentElement.children[c].offsetLeft + this.parentElement.children[c].clientWidth - posX;
				if (posY < this.parentElement.children[c].offsetTop && this.parentElement.children[c].offsetTop < posY + this.clientHeight){
					const dy= this.clientHeight + posY - this.parentElement.children[c].offsetTop;
					if (dx > dy) posY = this.parentElement.children[c].offsetTop - this.clientHeight;
					else posX = this.parentElement.children[c].offsetLeft + this.parentElement.children[c].clientWidth;
				}
				else if (posY < this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight && this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight < posY + this.clientHeight){
					const dy= this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight - posY;
					if (dx > dy) posY = this.parentElement.children[c].offsetTop + this.parentElement.children[c].clientHeight;
					else posX = this.parentElement.children[c].offsetLeft + this.parentElement.children[c].clientWidth;
	}}}}
	return [ posX, posY ];
}