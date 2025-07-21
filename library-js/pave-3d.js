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
HTMLElement.prototype.styleSide = function (width, ecartLeft, depth, angle, background, border){
	this.styleFace (background, border);
	this.style.width = width + 'px';
	this.style.left = ecartLeft + 'px';
	this.style.transform = 'rotateY(' + angle + 'deg) translateZ(' + depth + 'px)';
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
		const angle = 360 / this.sideNb;
		var angleTmp =0;
		const ecartLeft = (this.width - this.sideWidth) /2;
		for (var c=0; c< this.sideNb; c++){
			this.children[c+2].styleSide (this.sideWidth, ecartLeft, this.depth, angleTmp, this.background, this.border);
			angleTmp += angle;
		}
		/*/ adapter le sens des écritures selon le sens de rotation
		if (this.sideNb %2 ===0 && this.className.includes ('vertical')){
			const idMilieu = this.sideNb /2 +1;
			this.children[idMilieu].style.transform = 'rotateX(' + angle * (idMilieu -2) + 'deg) translateZ(' + this.depth + 'px)';
			this.classList.remove ('vertical');
		}*/
}}
class ShapeQuart extends Shape3d{
	connectedCallback(){
		this.styleShape();
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
				mutations[0].target.style.background = 'linear-gradient(transparent 49.5%, maroon 49.5% 50.5%, transparent 50.5%), linear-gradient(90deg, #0844 49.5%, maroon 49.5% 50.5%, #0844 50.5%)';
			//	mutations[0].target.style.background = 'none';
		}});
		attributeObserver.observe (this, { attributes: true });
		this.style.background = 'linear-gradient(transparent 49.5%, maroon 49.5% 50.5%, transparent 50.5%), linear-gradient(90deg, #0844 49.5%, maroon 49.5% 50.5%, #0844 50.5%)';
		this.styleSides();
	}
//	setSide(){ this.sideWidth = this.width *0.25* Math.PI / this.sideNb; }
	setSide(){ this.sideWidth = this.width *0.25* Math.PI /12; }
	styleSides(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
		const ecartLeft = rayon -6;
		const angle = 90 / 12;
		var angleTmp = angle /2.0;
		for (var c=0; c<12; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angleTmp, this.background, 'none');
			angleTmp += angle;
}}}
class TubeQuart extends ShapeQuart{
	constructor(){ super (12); }
	connectedCallback(){
		this.style.height = 'inherit';
		super.connectedCallback();
	}
	setSide(){ this.sideWidth = this.width *0.25* Math.PI / this.sideNb; }
	styleSides(){
		for (var c=0; c< this.sideNb +1; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
		const ecartLeft = rayon - this.sideWidth /2;
		const angle = 90 / this.sideNb;
		var angleTmp = angle /2.0;
		for (var c=0; c< this.sideNb; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angleTmp, this.background, 'none');
			angleTmp += angle;
	}}




	styleSides_va(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
		const ecartLeft = rayon - this.sideWidth /2;
		const angle = 90 / this.sideNb;
		var angleTmp = angle /2.0;
		for (var c=0; c< this.sideNb; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angleTmp, this.background, 'none');
			angleTmp += angle;
}}}
class BoulQuart extends ShapeQuart{
	constructor(){ super (36); }
	setSide(){ this.sideWidth = this.width * Math.PI /48; }	// 6.545%
	styleSides_vc(){
		this.style.width = this.width +'px';
		this.style.height = this.width +'px';
		this.appendChild (document.createElement ('tube-quart'));
		this.children[0].style.height = this.sideWidth + 'px';
		this.children[0].style.position = 'absolute';
		this.children[0].style.top = '50%';
		this.appendChild (document.createElement ('tube-quart'));
		this.children[1].style.height = this.sideWidth + 'px';
		this.children[1].style.position = 'absolute';
		this.children[1].style.left = this.width /2 + this.sideWidth /2 + 'px';
		this.children[1].style.top = '-50%';
		this.children[1].style.transform = 'rotateZ(90deg)';
	}
	styleSides(){
		this.style.width = this.width +'px';
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		// préparer 13 éléments
		const sideWidth = this.sideWidth + 'px';
		
		for (var c=0; c<13; c++){
			this.appendChild (document.createElement ('p'));
			this.children[c].style.width = sideWidth;
			this.children[c].style.transformOrigin = 'center center';
			this.children[c].style.position = 'absolute';
			this.children[c].style.backgroundColor = this.background;
			this.children[c].style.border = 'none';
			this.children[c].style.left = '50%';
		}
		// les extremités sont réduites
		this.children[0].style.transform = 'rotateY(90deg)';
		this.children[0].style.transformOrigin = 'center right';
		this.children[0].style.left = this.width - this.sideWidth /2 + 'px';
		this.children[0].style.width = this.sideWidth /2 + 'px';
		this.children[1].style.transform = 'translateZ(' + this.width /2 + 'px)';
		this.children[1].style.width = this.children[0].style.width;
		// les 11 faces du milieu
		const sideLeft = this.width /2 - this.sideWidth /2 + 'px';
		const sideTransform = 'rotateY($angle$deg) translateZ(' + this.width /2 + 'px)';
		var tour = 7.5;
		for (var c=1; c<12; c++){
			this.children[c].style.left = sideLeft;
			this.children[c].style.transform = sideTransform.replace ('$angle$', tour);
			tour +=7.5;
		}
	}
	styleSides_vd(){
		this.style.width = this.width +'px';
		this.style.height = this.width +'px';
		const sideTop = this.width /2 - this.sideWidth + 'px';
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		for (var c=0; c<14; c++){
		//	this.appendChild (document.createElement ('p'));
			this.children[c].style.width = this.sideWidth + 'px';
			this.children[c].style.height = this.sideWidth + 'px';
			this.children[c].style.transformOrigin = 'center center';
			this.children[c].style.position = 'absolute';
			this.children[c].style.left = '50%';
			this.children[c].style.backgroundColor = '#F046';
			this.children[c].style.border = 'solid 2px blue';
			this.children[c].innerHTML = c;
		}
		this.children[0].style.transform = 'rotateX(90deg)';
		this.children[0].style.transformOrigin = 'top center';
		this.children[0].style.top = '0';
		for (var c=1; c<14; c++){
			this.children[c].style.top = this.width /2 - this.sideWidth + 'px';
		}
		this.children[1].style.transform = 'rotateY(90deg)';
		this.children[1].style.transformOrigin = 'center right';
		this.children[1].style.left = this.width - this.sideWidth /2 + 'px';
		this.children[1].style.width = this.sideWidth /2 + 'px';
		this.children[2].style.transform = 'translateZ(' + this.width /2 + 'px)';
		this.children[2].style.width = this.children[1].style.width;
		var tour = 7.5;
		for (var c=3; c<14; c++){
			console.log (c, this.width);
			this.children[c].style.left = this.width /2 - this.sideWidth /2 + 'px';
			this.children[c].style.transform = 'rotateY(' + tour + 'deg) translateZ(' + this.width /2 + 'px)';
			tour +=7.5;
		}


		this.children[20].style.transform = 'rotateY(90deg)';
		this.children[20].style.top = '0';
		this.children[20].style.left = '0';
		this.children[20].style.width = 'inherit';
		this.children[20].style.height = 'inherit';
		this.children[20].style.background = 'linear-gradient(transparent 49.5%, maroon 49.5% 50.5%, transparent 50.5%), linear-gradient(90deg, #0844 49.5%, maroon 49.5% 50.5%, #0844 50.5%)';
	}
	styleSides_va(){
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
		const rayon = this.width /2.0;
	//	const rayon = this.width * (1- Math.PI /96);
		const ecartLeft = this.width /2 - this.sideWidth /2;
		const ecartTop = rayon - this.sideWidth;
		console.log (this.sideWidth);
		// la base
		var angleX =3.75;
		for (var c=0; c<12; c++){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angleX, this.background, 'none');
			this.children[c].style.height = this.sideWidth + 'px';
			this.children[c].style.top = ecartTop + 'px';
			angleX += 7.5;
		}
		// les cotés
		angleX -=7.5;
		var angleY =11.25;
		for (var c=12; c<34; c+=2){
			this.children[c].styleSide (this.sideWidth, ecartLeft, rayon, angleX, this.background, 'solid 2px blue');
			this.children[c].style.height = this.sideWidth + 'px';
			this.children[c].style.top = ecartLeft + 'px';
			this.children[c].style.transform = this.children[c].style.transform.replace ('translateZ', 'rotateX(' + angleY + 'deg) translateZ');
			/*
			this.children[c+1].styleSide (this.sideWidth, ecartLeft, rayon, 3.75, this.background, 'solid 2px blue');
			this.children[c+1].style.height = this.sideWidth + 'px';
			this.children[c+1].style.top = ecartLeft + 'px';
			this.children[c+1].style.transform = this.children[c+1].style.transform.replace ('translateZ', 'rotateX(' + angleY + 'deg) translateZ');
			this.children[c+1].style.clipPath = 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)';
			*/
			angleY += 7.5;
		}
		// la pointe
		this.children[34].styleSide (this.sideWidth *1.05, ecartLeft, rayon, 3.75, this.background, 'none');
		this.children[34].style.height = this.sideWidth + 'px';
		this.children[34].style.top = ecartLeft + 'px';
		this.children[34].style.transform = this.children[34].style.transform.replace ('translateZ', 'rotateX(90deg) translateZ');
		this.children[34].style.clipPath = 'polygon(0% 0%, 100% 7.5%, 100% 100%, 0% 100%)';

		this.children[35].style.background = '#0486';
		this.children[35].style.width = this.sideWidth + 'px';
		this.children[35].style.height = this.sideWidth + 'px';
		this.children[35].style.position = 'absolute';
		this.children[35].style.left = '50%';
		this.children[35].style.transform = 'rotateX(90deg)';
		this.children[35].style.transformOrigin = 'top center';
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
		const angle = 360 / this.sideNb;
		var angleTmp =0;
		const ecartLeft = (this.width - this.sideWidth) /2;
		for (var c=0; c< this.sideNb; c++){
			this.children[c+2].styleSide (this.sideWidth, ecartLeft, this.depth, angleTmp, this.background, this.border);
			this.children[c+2].style.borderLeft = 'none';
			this.children[c+2].style.borderRight = 'none';
			angleTmp += angle;
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

