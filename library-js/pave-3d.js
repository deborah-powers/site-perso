/* dessiner des formes 3D
fonctionne avec pave-3d.css
créer automatiquement les faces des formes
nécessaire pour les formes comportant des courbes
*/
function mutationNb (mutations){
	// mutations est un MutationRecord
	var nbChildren =0;
	mutations.forEach (function (mutation){
		if (mutation.type === 'childList' && mutation.addedNodes.length && mutation.addedNodes[0].constructor.name !== 'Text')
			nbChildren +=1;
	});
	return nbChildren;
}
class Shape3d extends HTMLElement{
	constructor (faceNb){
		super();
		this.faceNb = faceNb;
	}
	connectedCallback(){
		// ajouter les enfants manquants
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren < self.faceNb) self.appendChild (document.createElement ('p'));
		});
		observer.observe (this, { childList: true });
}}
class Pave3d extends Shape3d{ constructor(){ super (6); }}
class Trig3d extends Shape3d{ constructor(){ super (5); }}
class Trec3d extends Shape3d{ constructor(){ super (5); }}
class Hexa3d extends Shape3d{ constructor(){ super (8); }}
class Octo3d extends Shape3d{ constructor(){ super (10); }}
class Prmd3d extends Shape3d{ constructor(){ super (5); }}
class TubQ3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('p')); }
}
class Tube3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){
		console.log ('Tube3d connectedCallback');
		for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('tub-q3d')); }
}
class Cyld3d extends Shape3d{
	constructor(){ super (3); }
	connectedCallback(){
		// ajouter les enfants manquants
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <2) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('tube-3d'));
		});
		observer.observe (this, { childList: true });
}}
class ConQ3d extends Shape3d{
	constructor(){ super (12); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('p')); }
}
class ConC3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('con-q3d')); }
}
class Cone3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <1) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('con-c3d'));
		});
		observer.observe (this, { childList: true });
}}
class CwnQ3d extends Shape3d{
	constructor(){ super (48); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('p')); }
}
class BolC3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('cwn-q3d')); }
}
class Bole3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <1) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('bol-c3d'));
		});
		observer.observe (this, { childList: true });
}}
class Boul3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('bol-c3d')); }
}
class Boul3db extends Shape3d{
	constructor(){ super (8); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('cwn-q3d')); }
}
class Caps3d extends Shape3d{
	constructor(){ super (3); }
	connectedCallback(){
		this.appendChild (document.createElement ('bol-c3d'));
		this.appendChild (document.createElement ('bol-c3d'));
		this.appendChild (document.createElement ('tube-3d'));
}}
class Chfr3d extends Shape3d{
	constructor(){ super (10); }
	connectedCallback(){
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <6) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('tub-q3d'));
		});
		observer.observe (this, { childList: true });
}}
class Matl3d extends Shape3d{
	constructor(){ super (26); }
	connectedCallback(){
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <6) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb -8) self.appendChild (document.createElement ('tub-q3d'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('cwn-q3d'));
		});
		observer.observe (this, { childList: true });
}}
class Cyld3db extends Shape3d{
	constructor(){ super (6); }
	connectedCallback(){
		// ajouter les enfants manquants
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren <2) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('tub-q3d'));
		});
		observer.observe (this, { childList: true });
}}
class Piece3d extends Shape3d{
	constructor(){ super (6); }
	connectedCallback(){
		// compter les fenêtres
		const nbwStr = this.getAttribute ('fenetres');
		var nbWindows =0;
		if (nbwStr !== null) nbWindows = parseInt (nbwStr);
		// ajouter les enfants manquants
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren = nbChildren + mutationNb (mutations);
			if (nbChildren < self.faceNb) self.appendChild (document.createElement ('p'));
			else if (nbChildren < self.faceNb + nbWindows) self.appendChild (document.createElement ('fenetre'));
		});
		observer.observe (this, { childList: true });
}}
customElements.define ('pave-3d', Pave3d);
customElements.define ('tiso-3d', Trig3d);
customElements.define ('trec-3d', Trec3d);
customElements.define ('hexa-3d', Hexa3d);
customElements.define ('octo-3d', Octo3d);
customElements.define ('prmd-3d', Prmd3d);
customElements.define ('tub-q3d', TubQ3d);
customElements.define ('tube-3d', Tube3d);
customElements.define ('cwn-q3d', CwnQ3d);
customElements.define ('bol-c3d', BolC3d);
customElements.define ('bole-3d', Bole3d);
customElements.define ('cyld-3d', Cyld3d);
customElements.define ('con-q3d', ConQ3d);
customElements.define ('con-c3d', ConC3d);
customElements.define ('cone-3d', Cone3d);
customElements.define ('boul-3d', Boul3d);
customElements.define ('chfr-3d', Chfr3d);
customElements.define ('matl-3d', Matl3d);
customElements.define ('caps-3d', Caps3d);
customElements.define ('piece-3d', Piece3d);

// les meubles
class piedCarre3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){
		var child = null;
		for (var c=0; c< this.faceNb; c++){
			child = new Pave3d();
			for (var d=0; d< child.faceNb; d++) child.appendChild (document.createElement ('p'));
			child.className = 'pole';
			this.appendChild (child);
}}}
class piedRond3d extends piedCarre3d{
	connectedCallback(){
		var child = null;
		for (var c=0; c< this.faceNb; c++){
			child = new Tube3d();
			this.appendChild (child);
}}}
class Table3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){
		var child = new Pave3d();
		for (var p=0; p< child.faceNb; p++) child.appendChild (document.createElement ('p'));
		this.appendChild (child);
		this.appendChild (new piedRond3d());
}}
class Chaise3d extends Shape3d{
	constructor(){ super (6); }
	connectedCallback(){
		var element = document.createElement ('pave-3d');	// assise
		for (var d=0; d<6; d++) element.appendChild (document.createElement ('p'));
		this.appendChild (element);
		element = document.createElement ('pave-3d');	// dossier
		for (var d=0; d<6; d++) element.appendChild (document.createElement ('p'));
		this.appendChild (element);
		this.appendChild (new Tube3d());
		this.appendChild (new Tube3d());
		this.appendChild (new Tube3d());
		this.appendChild (new Tube3d());
}}
customElements.define ('piedcr-3d', piedCarre3d);
customElements.define ('piedrd-3d', piedRond3d);
customElements.define ('table-3d', Table3d);
customElements.define ('chaise-3d', Chaise3d);
