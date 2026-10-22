/* p {
	cursor: move;
	position: absolute;
	width: 60px;
	height: 60px;
}
parentElement.isContainer();
<p class='auto'></p>
<p class='drag'></p>
class = drag, drag-x, drag-y, click, auto
*/
var currentX =0;
var currentY =0;
var boundaries =[];	// left top bottom right
HTMLElement.prototype.isContainer = function(){
	this.setBoundaries();
	for (var child of this.children){
		if (child.className.includes ('drag-x')) child.addEventListener ('mousedown', dragSelectX);
		else if (child.className.includes ('drag-y')) child.addEventListener ('mousedown', dragSelectY);
		else if (child.className.includes ('drag')) child.addEventListener ('mousedown', dragSelect);
		else if (child.className.includes ('auto')) for (var n=0; n< 10; n++) child.autoMove();
		else if (child.className.includes ('click')) child.addEventListener ('mousedown', clickMove);
}}

/* ------------------------ drag-drop ------------------------ */

function dragDrop (paragraph){
	console.log ('dragdrop', paragraph);
	paragraph.removeAttribute ('onmousemove');
	paragraph.removeAttribute ('onmouseup');
//	paragraph.removeAttribute ('onmouseout');
}
function dragMove (paragraph){
	var dx= event.screenX - currentX;
	var dy= event.screenY - currentY;
	paragraph.move (dx, dy);
	currentX = event.screenX;
	currentY = event.screenY;
}
function dragMoveX (paragraph){
	var dx= event.screenX - currentX;
	paragraph.moveX (dx);
	currentX = event.screenX;
}
function dragMoveY (paragraph){
	var dy= event.screenY - currentY;
	paragraph.moveY (dy);
	currentY = event.screenY;
}
function dragSelect (event){
	currentX = event.screenX;
	currentY = event.screenY;
	event.target.setAttribute ('onmousemove', 'dragMove(this)');
	event.target.setAttribute ('onmouseup', 'dragDrop(this)');
//	event.target.setAttribute ('onmouseout', 'dragDrop(this)');
}
function dragSelectX (event){
	currentX = event.screenX;
	event.target.setAttribute ('onmousemove', 'dragMoveX(this)');
	event.target.setAttribute ('onmouseup', 'dragDrop(this)');
//	event.target.setAttribute ('onmouseout', 'dragDrop(this)');
}
function dragSelectY (event){
	currentY = event.screenY;
	event.target.setAttribute ('onmousemove', 'dragMoveY(this)');
	event.target.setAttribute ('onmouseup', 'dragDrop(this)');
//	event.target.setAttribute ('onmouseout', 'dragDrop(this)');
}
/* ------------------------ déplacement autonome ------------------------ */

HTMLElement.prototype.randoMove = function(){
	var dx = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0])) - this.offsetLeft;
	var dy = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]) - this.offsetTop;
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
function clickMove (event){ event.target.randoMove(); }
HTMLElement.prototype.autoMove = function(){ for (var i=0; i<50; i++) this.randoMove(); }
function autoMove_vb (event){
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
HTMLElement.prototype.moveX = function (dx){
	dx = this.offsetLeft + dx;
	const pos = this.senseBoundariesHorizontal (dx);
	this.style.left = pos + 'px';
}
HTMLElement.prototype.moveY = function (dy){
	dy = this.offsetTop + dy;
	const pos = this.senseBoundariesVertical (dy);
	this.style.top = pos + 'px';
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
HTMLElement.prototype.senseBoundariesVertical = function (posY){
	if (boundaries !== null && boundaries !== undefined && boundaries.length ===4){
		if (posY < boundaries[1]) posY = boundaries[1];
		else if (posY + this.clientHeight > boundaries[3]) posY = boundaries[3] - this.clientHeight;
	}
	return posY;
}
HTMLElement.prototype.senseBoundariesHorizontal = function (posX){
	if (boundaries !== null && boundaries !== undefined && boundaries.length ===4){
		if (posX < boundaries[0]) posX = boundaries[0];
		else if (posX + this.clientWidth > boundaries[2]) posX = boundaries[2] - this.clientWidth;
	}
	return posX;
}
HTMLElement.prototype.senseObstacle = function (posX, posY){
	for (var brother of this.parentElement.children) if (this !== brother){
		// relations entre les positions
		const trespass =[ false, false, false, false ];	// left top bottom right
		if (posX >= brother.offsetLeft) trespass[0] = true;
		if (posY >= brother.offsetTop) trespass[1] = true;
		if (posX <= brother.offsetLeft + brother.clientWidth) trespass[2] = true;
		if (posY <= brother.offsetTop + brother.clientHeight) trespass[3] = true;
		// vérification du chauvechement
		if (trespass[0] && (trespass[1] || trespass[3])) posX = brother.offsetLeft - this.clientWidth;
		else if (trespass[2] && (trespass[1] || trespass[3])) posX = brother.offsetLeft + brother.clientWidth;
		if (trespass[1] && (trespass[0] || trespass[2])) posY = brother.offsetLeft - this.clientHeight;
		else if (trespass[3] && (trespass[0] || trespass[2])) posY = brother.offsetLeft + brother.clientHeight;
	}
	return [ posX, posY ];
}
HTMLElement.prototype.senseObstacle_va = function (posX, posY){
	for (var brother of this.parentElement.children) if (this !== brother){
		if (posX < brother.offsetLeft && brother.offsetLeft < posX + this.clientWidth){
			const dx = this.clientWidth + posX - brother.offsetLeft;
			if (posY < brother.offsetTop && brother.offsetTop < posY + this.clientHeight){
				const dy= this.clientHeight + posY - brother.offsetTop;
				if (dx > dy) posY = brother.offsetTop - this.clientHeight;
				else posX = brother.offsetLeft - this.clientWidth;
			}
			else if (posY < brother.offsetTop + brother.clientHeight && brother.offsetTop + brother.clientHeight < posY + this.clientHeight){
				const dy= brother.offsetTop + brother.clientHeight - posY;
				if (dx > dy) posY = brother.offsetTop + brother.clientHeight;
				else posX = brother.offsetLeft - this.clientWidth;
		}}
		else if (posX < brother.offsetLeft + brother.clientWidth && brother.offsetLeft + brother.clientWidth < posX + this.clientWidth){
			const dx = brother.offsetLeft + brother.clientWidth - posX;
			if (posY < brother.offsetTop && brother.offsetTop < posY + this.clientHeight){
				const dy= this.clientHeight + posY - brother.offsetTop;
				if (dx > dy) posY = brother.offsetTop - this.clientHeight;
				else posX = brother.offsetLeft + brother.clientWidth;
			}
			else if (posY < brother.offsetTop + brother.clientHeight && brother.offsetTop + brother.clientHeight < posY + this.clientHeight){
				const dy= brother.offsetTop + brother.clientHeight - posY;
				if (dx > dy) posY = brother.offsetTop + brother.clientHeight;
				else posX = brother.offsetLeft + brother.clientWidth;
	}}}
	return [ posX, posY ];
}