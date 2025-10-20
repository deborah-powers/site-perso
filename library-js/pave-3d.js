/* dessiner des formes 3D
fonctionne avec pave-3d.css
créer automatiquement les faces des formes
nécessaire pour les formes comportant des courbes
*/
function mutationNb (mutations){
	// mutations est un MutationRecord
	var nbChildren =0;
	mutations.forEach (function (mutation){
		if (mutation.addedNodes.length && mutation.addedNodes[0].constructor.name !== 'Text') nbChildren +=1;
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
class TubQ3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('p')); }
}
class Tube3d extends Shape3d{
	constructor(){ super (4); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('tub-q3d')); }
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
class CwnQ3d extends Shape3d{
	constructor(){ super (48); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('p')); }
}
class Hbol3d extends Shape3d{
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
			else if (nbChildren < self.faceNb) self.appendChild (document.createElement ('hbol-3d'));
		});
		observer.observe (this, { childList: true });
}}
class Boul3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('hbol-3d')); }
}
class Boul3db extends Shape3d{
	constructor(){ super (8); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++) this.appendChild (document.createElement ('cwn-q3d')); }
}
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
class Sphd3d extends Shape3d{
	constructor(){ super (2); }
	connectedCallback(){ for (var c=0; c< this.faceNb; c++){
		this.appendChild (document.createElement ('bole-3d'));
		this.children[c].appendChild (document.createElement ('p'));
}}}
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
customElements.define ('pave-3d', Pave3d);
customElements.define ('tiso-3d', Trig3d);
customElements.define ('trec-3d', Trec3d);
customElements.define ('hexa-3d', Hexa3d);
customElements.define ('octo-3d', Octo3d);
customElements.define ('tub-q3d', TubQ3d);
customElements.define ('tube-3d', Tube3d);
customElements.define ('cwn-q3d', CwnQ3d);
customElements.define ('hbol-3d', Hbol3d);
customElements.define ('bole-3d', Bole3d);
customElements.define ('cyld-3d', Cyld3d);
customElements.define ('boul-3d', Boul3d);
customElements.define ('chfr-3d', Chfr3d);
customElements.define ('matl-3d', Matl3d);
customElements.define ('sphd-3d', Sphd3d);
