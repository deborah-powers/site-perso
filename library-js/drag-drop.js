/* p {
	cursor: move;
	position: absolute;
	width: 60px;
	height: 60px;
}
p.parentElement.setBoundaries();
<p onmousedown='selectElement(this)'></p>
<p onmousedown='moveElementAuto(this)'></p>
*/
// pour l'interractivité
var currentX =0;
var currentY =0;
var boundaries =[];

function selectElement (paragraph){
	currentX = event.screenX;
	currentY = event.screenY;
	paragraph.setAttribute ('onmousemove', 'moveElement(this)');
	paragraph.setAttribute ('onmouseup', 'deselectElement(this)');
	paragraph.setAttribute ('onmouseout', 'deselectElement(this)');
}
function deselectElement (paragraph){
	paragraph.removeAttribute ('onmousemove');
	paragraph.removeAttribute ('onmouseup');
	paragraph.removeAttribute ('onmouseout');
}
function moveElement (paragraph){
	var dx= event.screenX - currentX;
	var dy= event.screenY - currentY;
	paragraph.drag (dx, dy);
	currentX = event.screenX;
	currentY = event.screenY;
}
function moveElementAuto_vb (paragraph){
	const posX = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0]));
	const posY = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]);
	var dx= (posX - paragraph.offsetLeft);
	const secMax = Math.abs (dx);
	const dy= (posY - paragraph.offsetTop) / secMax;
	if (dx <0) dx =-1;
	else if (dx >0) dx =1;
	let secNb = 0;
	function animate(){
		secNb +=1;
		paragraph.drag (dx, dy);
		if (secNb < secMax) requestAnimationFrame (animate);
	}
	animate();
}
function moveElementAuto (paragraph){
	const posX = boundaries[0] + Math.floor (Math.random() * (boundaries[2] - boundaries[0]));
	const posY = boundaries[1] + Math.floor (Math.random() * boundaries[3] - boundaries[1]);
	const dx= (posX - paragraph.offsetLeft) /60;
	const dy= (posY - paragraph.offsetTop) /60;
	let secNb = 0;
	function animate(){
		secNb +=1;
		paragraph.drag (dx,dy);
		if (secNb <60) requestAnimationFrame (animate);
	}
	animate();
}
HTMLElement.prototype.drag = function (dx, dy){
	dx = this.offsetLeft + dx;
	dy = this.offsetTop + dy;
	var pos = this.senseObstacle (dx, dy);
	pos = this.senseBoundaries (pos[0], pos[1]);
	this.style.left = pos[0] + 'px';
	this.style.top = pos[1] + 'px';
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