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

/* ------------ les fonctions utilitaires ------------ */

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
const backgroundCross = `
		repeating-linear-gradient(90deg, transparent 0.9em, maroon 0.9em 1em, transparent 1em 1.9em),
		repeating-linear-gradient(90deg, transparent 4.8em, maroon 4.8em 5em, transparent 5em 9.8em),
		repeating-linear-gradient(transparent 0.9em, maroon 0.9em 1em, transparent 1em 1.9em),
		repeating-linear-gradient(#0849 4.8em, maroon 4.8em 5em, wheat 5em 9.8em)`;
// const backgroundCross = 'linear-gradient(transparent 49.5%, maroon 49.5% 50.5%, transparent 50.5%), linear-gradient(90deg, #0849 49.5%, maroon 49.5% 50.5%, #0849 50.5%)';
HTMLElement.prototype.addCross = function(){
	this.style.backgroundImage = backgroundCross;
	const posF = this.children.length -1;
	this.children[posF].style.transform = 'rotateY(90deg)';
	this.children[posF].style.top = '0';
	this.children[posF].style.left = '0';
	this.children[posF].style.width = 'inherit';
	this.children[posF].style.height = 'inherit';
	this.children[posF].style.backgroundColor = 'none';
	this.children[posF].style.background = backgroundCross;
}
HTMLElement.prototype.styleShape = function(){
	this.style.display = 'block';
	this.style.padding = '0';
	this.style.textAlign = 'center';
	this.style.transformStyle = 'preserve-3d';
	this.style.backgroundPosition = 'center';
}
HTMLElement.prototype.styleFace = function (background, border){
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
HTMLElement.prototype.styleSide = function (width, ecartLeft, depth, anglePas, background, border){
	this.styleFace (background, border);
	this.style.width = width + 'px';
	this.style.left = ecartLeft + 'px';
	this.style.transform = 'rotateY(' + anglePas + 'deg) translateZ(' + depth + 'px)';
}
/* ------------ les portions de formes ------------ */

class Shape3d extends HTMLElement{
	constructor (sideNb){
		super();
		this.sideNb = sideNb;
		// mise en forme
		this.vraiStyle = null;
		this.background ="";
		this.border ="";
		this.width =0
		this.height =0
		this.depth =0;
		this.sideWidth =0;
	}
	connectedCallback(){
		this.styleShape();
		// infos pour styler les enfants
		this.vraiStyle = getComputedStyle (this);
		this.width = this.vraiStyle.width.fromPx();
		this.setHeight();
		this.setDepth();
		this.background = this.vraiStyle.background;
		this.border = this.vraiStyle.border;
		this.style.border = 'none';

		// styler les enfants et corriger leur nombre
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren < self.sideNb +2) self.appendChild (document.createElement ('p'));
			else{
				self.setSide();
				self.styleHat();
				self.styleSides();
		}});
		observer.observe (this, { childList: true });
		this.style.background = 'none';
	}
	// modifier selon la forme
	setHeight(){ this.height = this.vraiStyle.height.fromPx(); }
	setDepth(){ this.depth = this.width /2.0; }
	setSide(){ this.sideWidth = this.width; }
	styleHat(){
		this.children[0].styleFace (this.background, this.border);
		this.children[0].style.height = 2* this.depth + 'px';
		this.children[0].style.transform = 'rotateX(90deg) translateZ(' + this.depth + 'px)';
		this.children[0].id = 'top';
		this.children[1].styleFace (this.background, this.border);
		this.children[1].style.height = 2* this.depth + 'px';
		this.children[1].style.transform = 'rotateX(-90deg) translateZ(' + (this.height - this.depth) + 'px)';
		this.children[1].id = 'bottom';
	}
	styleSides(){
		const anglePas = 360 / this.sideNb;
		var angle =0;
		const ecartLeft = (this.width - this.sideWidth) /2;
		for (var c=0; c< this.sideNb; c++){
			this.children[c+2].styleSide (this.sideWidth, ecartLeft, this.depth, angle, this.background, this.border);
			angle += anglePas;
		}
		/*/ adapter le sens des écritures selon le sens de rotation
		if (this.sideNb %2 ===0 && this.className.includes ('vertical')){
			const idMilieu = this.sideNb /2 +1;
			this.children[idMilieu].style.transform = 'rotateX(' + anglePas * (idMilieu -2) + 'deg) translateZ(' + this.depth + 'px)';
			this.classList.remove ('vertical');
		}*/
}}
class ShapeQuart extends Shape3d{
	connectedCallback(){
		this.styleShape();
		this.style.width = 'inherit';
		this.style.height = 'inherit';
		// infos pour styler les enfants
		this.vraiStyle = getComputedStyle (this.parentElement);
		this.width = this.vraiStyle.width.fromPx();
		this.setHeight();
		this.setDepth();
		this.setSide();
		this.background = this.vraiStyle.background;
		this.border = 'none';
		this.style.border = 'none';
		// récupérer le style attribué à l'élément
		var attributeObserver = new MutationObserver (function (mutations){
			if ('style' === mutations[0].attributeName && 'none' !== mutations[0].target.style.background){
				this.background = mutations[0].target.style.background;
				mutations[0].target.style.background = 'none';
		}});
		attributeObserver.observe (this, { attributes: true });
		this.style.background = 'none';
		this.styleSides();
	}
//	setSide(){ this.sideWidth = this.width *0.25* Math.PI / this.sideNb; }
	setSide(){ this.sideWidth = this.width *0.25* Math.PI /12; }
	styleSides(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
		const ecartLeft = rayon -6;
		const anglePas = 90 / 12;
		var angle = anglePas /2.0;
		for (var c=0; c<12; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
			angle += anglePas;
}}}
class TubeQuart extends ShapeQuart{
	constructor(){ super (12); }
	connectedCallback(){
		this.style.height = 'inherit';
		super.connectedCallback();
	}
	setSide(){ this.sideWidth = this.width *0.25* Math.PI / this.sideNb; }
	styleSides(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
		const ecartLeft = rayon - this.sideWidth /2;
		const anglePas = 90 / this.sideNb;
		var angle = anglePas /2.0;
		for (var c=0; c< this.sideNb; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
			angle += anglePas;
}}}
class BoulQuart extends ShapeQuart{
	constructor(){ super (110); }
	setSide(){ this.sideWidth = this.width * Math.PI /48; }	// 6.545%
	styleSides(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		// les cotés
		const rayon = this.width /2.0;
		const ecartLeft = rayon - this.sideWidth /2;
		var ecartTop = rayon - this.sideWidth;
		const ecartTopPas = this.sideWidth /24;
		const anglePas = 7.5;	// 90/12
		var angle = anglePas /2.0;
		var anglePasY =0;
		for (var b=1; b<61; b+=12){
			angle = 3.75;
			for (var c=b; c<b+12; c++){
				this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
				this.children[c].style.height = this.children[c].style.width;
				this.children[c].style.top = ecartTop + 'px';
				this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
				angle +=7.5;
			}
			anglePasY +=7.5;
			ecartTop += ecartTopPas;
		}
		for (var b=61; b<81; b+=10){
			angle = 4.5;
			for (var c=b; c<b+10; c++){
				this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
				this.children[c].style.height = this.children[c].style.width;
				this.children[c].style.top = ecartTop + 'px';
				this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
				angle +=9;
			}
			anglePasY +=7.5;
			ecartTop += ecartTopPas;
		}
		for (var b=81; b<97; b+=8){
			angle = 5.625;
			for (var c=b; c<b+8; c++){
				this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
				this.children[c].style.height = this.children[c].style.width;
				this.children[c].style.top = ecartTop + 'px';
				this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
				angle +=11.25;
			}
			anglePasY +=7.5;
			ecartTop += ecartTopPas;
		}
		angle = 7.5;
		for (var c=97; c<103; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
			this.children[c].style.height = this.children[c].style.width;
			this.children[c].style.top = ecartTop + 'px';
			this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
			angle +=15;
		}
		anglePasY +=7.5;
		ecartTop += ecartTopPas;
		angle = 11.25;
		for (var c=103; c<107; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
			this.children[c].style.height = this.children[c].style.width;
			this.children[c].style.top = ecartTop + 'px';
			this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
			angle +=22.5;
		}
		anglePasY +=7.5;
		ecartTop += ecartTopPas;
		angle = 15;
		for (var c=107; c<110; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angle, this.background, 'none');
			this.children[c].style.height = this.children[c].style.width;
			this.children[c].style.top = ecartTop + 'px';
			this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + anglePasY + 'deg) translateZ');
			angle +=30;
		}
		// le sommet
		this.children[0].style.position = 'absolute';
		this.children[0].style.top = '0';
		this.children[0].style.left = '50%';
		this.children[0].style.width = '5%';
		this.children[0].style.height = '5%';
		this.children[0].style.background = this.background;
		this.children[0].style.transform = 'rotateX(90deg)';
		this.children[0].style.transformOrigin = 'top center';
		this.children[0].style.borderBottomRightRadius = '50%';
}}
/* ------------ les formes complètes ------------ */

class Pole extends Shape3d{
	constructor(){ super (4); }
	styleSides(){
		super.styleSides();
		// adapter le sens des écritures selon le sens de rotation
		if (this.className.includes ('vertical')){
			this.children[4].style.transform = 'rotateX(180deg) translateZ(' + this.depth + 'px)';
			this.classList.remove ('vertical');
}}}
class Pave extends Pole{
	setDepth(){ this.depth = this.vraiStyle.getPropertyValue ('--depth').coorDtoPx() /2.0; }
	styleSides(){
		super.styleSides();
		this.children[3].style.width = 2* this.depth + 'px';
		this.children[3].style.transform = 'rotateY(90deg) translateZ(' + (this.width - this.depth) + 'px)';
		this.children[5].style.width = 2* this.depth + 'px';
}}
class Cube extends Pole{
	setHeight(){
		this.height = this.width;
		this.style.height = this.width + 'px';
	}
	styleSides(){
		super.styleSides();
		this.children[2].style.height = this.width + 'px';
		this.children[3].style.height = this.width + 'px';
		this.children[4].style.height = this.width + 'px';
		this.children[5].style.height = this.width + 'px';
}}
class Hexa extends Shape3d{
	constructor(){ super (6); }
	setDepth(){ this.depth = this.width * 0.433; }
	setSide(){ this.sideWidth = this.width /2; }
	styleHat(){
		super.styleHat();
		this.children[0].style.clipPath = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';
		this.children[1].style.clipPath = 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';
}}
class Tequi extends Shape3d{
	constructor(){ super (3); }
	setDepth(){ this.depth = this.width * 0.433; }
	styleHat(){
		super.styleHat();
		this.children[0].style.clipPath = 'polygon(0 100%, 100% 100%, 50% 0)';
		this.children[1].style.clipPath = 'polygon(0 0, 100% 0, 50% 100%)';
	}
	styleSides(){
		super.styleSides();
		this.children[3].style.transform = 'rotateY(120deg) translateZ(' + this.depth /2 + 'px) translateX(-12.5%)';
		this.children[4].style.transform = 'rotateY(240deg) translateZ(' + this.depth /2 + 'px) translateX(12.5%)';
}}
class Trect extends Tequi{
	setDepth(){ this.depth = this.width * 0.25; }
	styleSides(){
		super.styleSides();
		const width = this.width * -0.145;
		this.children[3].style.width = '71%';
		this.children[3].style.transform = 'rotateY(-45deg)';
		this.children[3].style.left = 1.6* this.depth + 'px';
		this.children[4].style.width = '71%';
		this.children[4].style.transform = 'rotateY(45deg)';
		this.children[4].style.left = -0.4* this.depth + 'px';
}}
class Octo extends Shape3d{
	constructor(){ super (8); }
	setSide(){ this.sideWidth = this.width * 0.414213; }
	styleHat(){
		super.styleHat();
		this.children[0].style.clipPath = 'polygon(29.28935% 0, 70.71065% 0, 100% 29.28935%, 100% 70.71065%, 70.71065% 100%, 29.28935% 100%, 0 70.71065%, 0 29.28935%)';
		this.children[1].style.clipPath = 'polygon(29.28935% 0, 70.71065% 0, 100% 29.28935%, 100% 70.71065%, 70.71065% 100%, 29.28935% 100%, 0 70.71065%, 0 29.28935%)';
}}
class Cylindre extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){
		this.styleShape();
		// style des enfants
		this.vraiStyle = getComputedStyle (this);
		this.width = this.vraiStyle.width.fromPx();
		this.setHeight();
		this.setDepth();
		this.background = this.vraiStyle.background;
		this.border = this.vraiStyle.border;
		// styler les enfants et corriger leur nombre
		this.setSide();
		this.style.border = 'none';
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <2) self.appendChild (document.createElement ('p'));
			else if (nbChildren <6) self.appendChild (document.createElement ('tube-quart'));
			else{
				self.styleHat();
				self.styleSides();
				self.style.background = 'none';
		}});
		observer.observe (this, { childList: true });
	}
	styleHat(){
		super.styleHat();
		this.children[0].style.borderRadius = '50%';
		this.children[1].style.borderRadius = '50%';
	}
	styleSides(){
		this.children[3].style.transform = 'rotateY(90deg) translateY(-100%)';
		this.children[4].style.transform = 'rotateY(180deg) translateY(-200%)';
		this.children[5].style.transform = 'rotateY(270deg) translateY(-300%)';
	}
}
class Cylindre_va extends Shape3d{
	constructor(){ super (48); }
	connectedCallback(){
		if (this.getAttribute ('sides')) this.sideNb = parseInt (this.getAttribute ('sides'));
		super.connectedCallback();
	}
	styleHat(){
		super.styleHat();
		this.children[0].style.borderRadius = '50%';
		this.children[1].style.borderRadius = '50%';
	}
	setSide(){ this.sideWidth = this.width * Math.PI / this.sideNb; }
	styleSides(){
		const anglePas = 360 / this.sideNb;
		var angle =0;
		const ecartLeft = (this.width - this.sideWidth) /2;
		for (var c=0; c< this.sideNb; c++){
			this.children[c+2].styleSide (this.sideWidth, ecartLeft, this.depth, angle, this.background, this.border);
			this.children[c+2].style.borderLeft = 'none';
			this.children[c+2].style.borderRight = 'none';
			angle += anglePas;
}}}
class Boule extends Shape3d{
	constructor(){ super (0); }
	connectedCallback(){
		this.styleShape();
		// style des enfants
		this.vraiStyle = getComputedStyle (this);
		this.width = this.vraiStyle.width.fromPx();
		this.setHeight();
		this.setDepth();
		this.background = 'none';
		this.border = 'none';
		// styler les enfants et corriger leur nombre
		this.setSide();
		this.styleSides();
		this.style.background = 'none';
		this.style.border = 'none';
	}
	setHeight(){
		this.height = this.width;
		this.style.width = this.width + 'px';
		this.style.height = this.width + 'px';
	}
	styleHat(){
		this.appendChild (document.createElement ('p'));
		this.appendChild (document.createElement ('p'));
		const ecartLeft = (this.width - this.sideWidth) /2;
		this.children[0].style.width = '10%';
		this.children[0].style.height = '10%';
		this.children[0].style.transform = 'rotateX(90deg) translateZ(' + this.depth /10.0 + 'px)';
		this.children[0].style.left = ecartLeft + 'px';
		this.children[1].style.width = '10%';
		this.children[1].style.height = '10%';
		this.children[1].style.transform = 'rotateX(-90deg) translateZ(' + (this.height - this.depth /10.0) + 'px)';
		this.children[1].style.left = ecartLeft + 'px';
	}
	styleSides(){
		this.appendChild (document.createElement ('boul-quart'));
		this.appendChild (document.createElement ('boul-quart'));
		this.children[1].style.transform = 'rotateY(90deg) translateY(-100%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[2].style.transform = 'rotateY(180deg) translateY(-200%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[3].style.transform = 'rotateY(270deg) translateY(-300%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[4].style.transform = 'rotateX(180deg) translateY(400%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[5].style.transform = 'rotateX(180deg) rotateY(90deg) translateY(500%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[6].style.transform = 'rotateX(180deg) rotateY(180deg) translateY(600%)';
		this.appendChild (document.createElement ('boul-quart'));
		this.children[7].style.transform = 'rotateX(180deg) rotateY(270deg) translateY(700%)';
}}
customElements.define ('pole-3d', Pole);
customElements.define ('cube-3d', Cube);
customElements.define ('hexa-3d', Hexa);
customElements.define ('equi-3d', Tequi);
customElements.define ('trec-3d', Trect);
customElements.define ('octo-3d', Octo);
customElements.define ('pave-3d', Pave);
customElements.define ('cyld-3d', Cylindre);
customElements.define ('boul-3d', Boule);
customElements.define ('tube-quart', TubeQuart);
customElements.define ('boul-quart', BoulQuart);

