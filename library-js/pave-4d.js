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
/* ------------ les portions de formes ------------ */

class Shape3d extends HTMLElement{
	constructor (sideNb){
		super();
		this.sideNb = sideNb;
		this.width =0
	}
	connectedCallback(){
		// styler les enfants et corriger leur nombre
		this.styleChildren();
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren < self.sideNb +2) self.appendChild (document.createElement ('p'));
			else{
				self.style.border = 'none';
				self.style.background = 'none';
		}});
		observer.observe (this, { childList: true });
	}
	styleChildren(){
		const vraiStyle = getComputedStyle (this);
		this.width = vraiStyle.width.fromPx();
		this.style.setProperty ('--with', this.width + 'px');
		this.style.setProperty ('--height', vraiStyle.height);
		this.style.setProperty ('--depth', 2* this.setDepth() + 'px');
		this.style.setProperty ('--fond', vraiStyle.background);
		this.style.setProperty ('--bord', vraiStyle.border);
	}
	// modifier selon la forme
	setDepth(){ return this.width /2.0; }
}
class ShapeQuart extends Shape3d{
	connectedCallback(){
		this.styleChildren();
		this.style.border = 'none';
		this.style.background = 'none';
		// styler les enfants et corriger leur nombre
		var attributeObserver = new MutationObserver (function (mutations){
			if ('style' === mutations[0].attributeName && 'none' !== mutations[0].target.style.background){
				this.background = mutations[0].target.style.background;
				mutations[0].target.style.background = 'linear-gradient(transparent 49%, maroon 49% 51%, transparent 51%), linear-gradient(90deg, springgreen 49%, maroon 49% 51%, springgreen 51%)';
			//	mutations[0].target.style.background = 'none';
		}});
		attributeObserver.observe (this, { attributes: true });
		for (var c=0; c< this.sideNb; c++) this.appendChild (document.createElement ('p'));
}}
class TubeQuart extends ShapeQuart{ constructor(){ super (12); }}
class BoulQuart extends ShapeQuart{ constructor(){ super (120); }}
/* ------------ les formes complètes ------------ */

class Pole extends Shape3d{ constructor(){ super (4); }}
class Pave extends Pole{
	setDepth(){ return window.getComputedStyle (this).getPropertyValue ('--depth').coorDtoPx() /2.0; }
}
class Cube extends Pole{ connectedCallback(){
	this.style.height = window.getComputedStyle (this).width;
	super.connectedCallback();
}}
class Hexa extends Shape3d{
	constructor(){ super (6); }
	setDepth(){ return this.width * 0.433; }
}
class Tequi extends Shape3d{
	constructor(){ super (3); }
	setDepth(){ return this.width * 0.433; }
}
class Trect extends Tequi{ setDepth(){ return this.width * 0.25; }}
class Octo extends Shape3d{ constructor(){ super (8); }}
class Cylindre extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){
		this.styleChildren();
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <2) self.appendChild (document.createElement ('p'));
			else if (nbChildren <6) self.appendChild (document.createElement ('tube-quart'));
			else{
				self.style.border = 'none';
				self.style.background = 'none';
		}});
		observer.observe (this, { childList: true });
}}
class Boule extends Shape3d{
	constructor(){ super (8); }
	connectedCallback(){
		this.styleChildren();
		this.appendChild (document.createElement ('boul-quart'));
		this.background = 'none';
		this.border = 'none';
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

