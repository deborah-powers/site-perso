/* créer un cube en 3d et le styler avec du css
inspiré de pave.css
actuellement hs

container {
	perspective: 800px;
	perspective-origin: 15% 150px;
}
pole-3d, pave-3d {
	width: 8em;
	height: 8em;
	color: limegreen;
	border: double 8px limegreen;
	background-color: #F0F8;
}
pave-3d { --depth: 3cm; }
<pave-3d>
	<p>top</p>
	<p>bottom</p>
	<p>back</p>
	<p>left</p>
	<p>right</p>
	<p>front</p>
</pave-3d>
*/
/* conversion unité vers pixel
	1cm = 37.7952756 px
*/
const uniTtoPx ={
	em: parseFloat (getComputedStyle (document.documentElement, null).fontSize),
	cm: 37.7952756 * window.devicePixelRatio, mm: 377.952756 * window.devicePixelRatio,
	in: 3.0 * window.devicePixelRatio
};
function mutationNb (mutations){
	// mutations est un MutationRecord
	var nbChildren =0;
	mutations.forEach (function (mutation){
		if (mutation.addedNodes.length && mutation.addedNodes[0].constructor.name !== 'Text') nbChildren +=1;
	});
	return nbChildren;
}
String.prototype.coorDtoPx = function(){
	const extention = this.slice (-2);
	const nbStr = this.slice (0, -2);
	var nb = parseInt (nbStr);
	if (extention === 'cm') nb = nb * uniTtoPx.cm;
	else if (extention === 'mm') nb = nb * uniTtoPx.mm;
	else if (extention === 'in') nb = nb * uniTtoPx.in;
	else if (extention === 'em') nb = nb * uniTtoPx.em;
	return nb;
}
String.prototype.fromPx = function(){
	const nbStr = this.slice (0, -2);
	var nb = parseInt (nbStr);
	return nb;
}
HTMLElement.prototype.createFace = function (background, border){
	this.style.margin = '0';
	this.style.textAlign = 'center';
	this.style.position = 'absolute';
	this.style.top = '0';
	this.style.left = '0';
	this.style.transformOrigin = 'center center';
	this.style.width = 'inherit';
	this.style.height = 'inherit';
	this.style.color = 'inherit';
	this.style.background = background;
	this.style.backgroundPosition = 'center';
	this.style.backgroundSize = 'contain';
	this.style.border = border;
}
HTMLElement.prototype.createSide = function (width, ecartLeft, depth, angle, background, border){
	this.createFace (background, border);
	this.style.width = width + 'px';
	this.style.left = ecartLeft + 'px';
	this.style.transform = 'rotateY(' + angle + 'deg) translateZ(' + depth + 'px)';
}
class Shape3d extends HTMLElement{
	constructor (nbFaces){
		super();
		this.nbFaces = nbFaces;
		// mise en forme
		this.vraiStyle = null;
		this.background ="";
		this.border ="";
		this.width =0
		this.height =0
		this.depth =0;
		this.side =0;
	}
	connectedCallback(){
		// style du cube
		this.style.display = 'block';
		this.style.padding = '0';
		this.style.textAlign = 'center';
		this.style.transformStyle = 'preserve-3d';
		this.style.backgroundPosition = 'center';
		// infos pour styler les enfants
		this.vraiStyle = getComputedStyle (this);
		this.width = this.vraiStyle.width.fromPx();
		this.setHeight();
		this.setDepth();
		this.background = this.vraiStyle.background;
		this.border = this.vraiStyle.border;
		this.style.background = 'none';
		this.style.border = 'none';

		// styler les enfants et corriger leur nombre
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren < self.nbFaces){
				self.appendChild (document.createElement ('p'));
			}
			else{
				console.log (self.width, self.height, self.depth);
				self.setSide();
				self.createHat();
				self.createSides();
		}});
		observer.observe (this, { childList: true });
	}
	// modifier selon la forme
	setHeight(){ this.height = this.vraiStyle.height.fromPx(); }
	setDepth(){ this.depth = this.vraiStyle.getPropertyValue ('--depth').coorDtoPx() /2.0; }
	setSide(){ this.side = this.width; }
	createHat(){
		this.children[0].createFace (this.background, this.border);
		this.children[0].style.height = 2* this.depth + 'px';
		this.children[0].style.transform = 'rotateX(90deg) translateZ(' + this.depth + 'px)';
		this.children[0].id = 'top';
		this.children[1].createFace (this.background, this.border);
		this.children[1].style.height = 2* this.depth + 'px';
		this.children[1].style.transform = 'rotateX(-90deg) translateZ(' + (this.height - this.depth) + 'px)';
		this.children[1].id = 'bottom';
	}
	createSides(){
		const angle = 360 / (this.nbFaces -2);
		var angleTmp =0;
		const ecartLeft = (this.width - this.side) /2;
		for (var c=2; c< this.nbFaces; c++){
			this.children[c].createSide (this.side, ecartLeft, this.depth, angleTmp, this.background, this.border);
			angleTmp += angle;
		}
		/*/ adapter le sens des écritures selon le sens de rotation
		if (this.nbFaces %2 ===0 && this.className.includes ('vertical')){
			const idMilieu = this.nbFaces /2 +1;
			this.children[idMilieu].style.transform = 'rotateX(' + angle * (idMilieu -2) + 'deg) translateZ(' + this.depth + 'px)';
			this.classList.remove ('vertical');
		}*/
}}
class Pole extends Shape3d{
	constructor(){ super (6); }
	setDepth(){ this.depth = this.width /2.0; }
	createSides(){
		super.createSides();
		// adapter le sens des écritures selon le sens de rotation
		if (this.className.includes ('vertical')){
			this.children[4].style.transform = 'rotateX(180deg) translateZ(' + this.depth + 'px)';
			this.classList.remove ('vertical');
}}}
class Pave extends Pole{
	setDepth(){ this.depth = this.vraiStyle.getPropertyValue ('--depth').coorDtoPx() /2.0; }
	createSides(){
		super.createSides();
		this.children[3].style.width = 2* this.depth + 'px';
		this.children[3].style.transform = 'rotateY(90deg) translateZ(' + (this.width - this.depth) + 'px)';
		this.children[5].style.width = 2* this.depth + 'px';
}}
class Cube extends Pole{
	setHeight(){
		this.height = this.width;
		this.style.height = this.width + 'px';
	}
	createSides(){
		super.createSides();
		this.children[2].style.height = this.width + 'px';
		this.children[3].style.height = this.width + 'px';
		this.children[4].style.height = this.width + 'px';
		this.children[5].style.height = this.width + 'px';
}}
class Hexa extends Shape3d{
	constructor(){ super (8); }
	setDepth(){ this.depth = this.vraiStyle.width.fromPx() * 0.433; }
	setSide(){ this.side = this.vraiStyle.width.fromPx() /2; }
	createHat(){
		super.createHat();
		this.children[0].style.clipPath = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';
		this.children[1].style.clipPath = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';
}}
class Tequi extends Shape3d{
	constructor(){ super (5); }
	setDepth(){ this.depth = this.vraiStyle.width.fromPx() * 0.433; }
	createHat(){
		super.createHat();
		this.children[0].style.clipPath = 'polygon(0 100%, 100% 100%, 50% 0)';
		this.children[1].style.clipPath = 'polygon(0 0, 100% 0, 50% 100%)';
	}
	createSides(){
		super.createSides();
		this.children[3].style.transform = 'rotateY(120deg) translateZ(' + this.depth /2 + 'px) translateX(-12.5%)';
		this.children[4].style.transform = 'rotateY(240deg) translateZ(' + this.depth /2 + 'px) translateX(12.5%)';
}}
class Trect extends Tequi{
	setDepth(){ this.depth = this.vraiStyle.width.fromPx() * 0.25; }
	createSides(){
		super.createSides();
		const width = this.vraiStyle.width.fromPx() * -0.145;
		this.children[3].style.width = '71%';
		this.children[3].style.transform = 'rotateY(-45deg)';
		this.children[3].style.left = 1.6* this.depth + 'px';
		this.children[4].style.width = '71%';
		this.children[4].style.transform = 'rotateY(45deg)';
		this.children[4].style.left = -0.4* this.depth + 'px';
}}
class Octo extends Shape3d{
	constructor(){ super (10); }
	setSide(){ this.side = this.vraiStyle.width.fromPx() * 0.414213; }
	createHat(){
		super.createHat();
		this.children[0].style.clipPath = 'polygon(29.28935% 0, 70.71065% 0, 100% 29.28935%, 100% 70.71065%, 70.71065% 100%, 29.28935% 100%, 0 70.71065%, 0 29.28935%)';
		this.children[1].style.clipPath = 'polygon(29.28935% 0, 70.71065% 0, 100% 29.28935%, 100% 70.71065%, 70.71065% 100%, 29.28935% 100%, 0 70.71065%, 0 29.28935%)';
}}
class Cylindre extends Shape3d{
	constructor(){ super (50); }
	createHat(){
		super.createHat();
		this.children[0].style.borderRadius = '50%';
		this.children[1].style.borderRadius = '50%';
	}
	setSide(){ this.side = this.vraiStyle.width.fromPx() * 0.065; }
	createSides(){
		const angle = 360 / (this.nbFaces -2);
		var angleTmp =0;
		const ecartLeft = (this.vraiStyle.width.fromPx() - this.side) /2;
		for (var c=2; c< this.nbFaces; c++){
			this.children[c].createSide (this.side, ecartLeft, this.depth, angleTmp, this.background, this.border);
			this.children[c].style.borderLeft = 'none';
			this.children[c].style.borderRight = 'none';
			angleTmp += angle;
}}}
class Boule extends Shape3d{
	constructor(){ super (98); }
	createHat(){
		super.createHat();
		this.children[0].style.width = '10%';
		this.children[0].style.borderRadius = '50%';
		this.children[1].style.width = '10%';
		this.children[1].style.borderRadius = '50%';
	}
	setDepth(){ this.depth = this.vraiStyle.width.fromPx() /2; }
	setSide(){ this.side = this.vraiStyle.width.fromPx() * 0.065; }
	createSides(){
		const angle = 360 / (this.nbFaces -2);
		var angleTmp =0;
		const ecartLeft = (this.vraiStyle.width.fromPx() - this.side) /2;
		for (var c=2; c< this.nbFaces; c++){
			this.children[c].createSide (this.side, ecartLeft, this.depth, angleTmp, this.background, this.border);
			this.children[c].style.borderLeft = 'none';
			this.children[c].style.borderRight = 'none';
			angleTmp += angle;
}}}
customElements.define ('pole-3d', Pole);
customElements.define ('hexa-3d', Hexa);
customElements.define ('equi-3d', Tequi);
customElements.define ('trec-3d', Trect);
customElements.define ('octo-3d', Octo);
customElements.define ('pave-3d', Pave);
customElements.define ('cyld-3d', Cylindre);
customElements.define ('boul-3d', Boule);
customElements.define ('cube-3d', Cube);
