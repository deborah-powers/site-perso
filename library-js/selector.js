/* afficher un sélecteur stylisable.
dépend de util.js et de structure.css

*** exemple ***

<select-db callback='myFunc' list='myList'></select-db>

var myList =[ 'a', 'b', 'c'];
function myFunc (name){ console.log ('coucou', name); }
*/
const selectorStyle =`
	select-db {
		display: block;
		border-style: solid;
		border-width: 6px;
	}
	select-db h2 {
		color: var(--page-color, white);
		background-color: var(--bord-color, #AAA);
		margin: 0;
	}
	select-db p { display: none; }
	select-db:hover p { display: block; }`;

class Selector extends HTMLElement{
	constructor(){
		super();
		this.callback = null;
		this.values =[];
	}
	connectedCallback(){
		// appelée après le constructeur
		setStyle (selectorStyle);
		var selector = this;
		// retarder l'initialisation du sélecteur. nécessaire si j'utilise des données javascript dans mes attributs
		window.addEventListener ('load', function (event){
			if (exists (selector.getAttribute ('callback')))
				selector.callback = selector.getAttribute ('callback').toVariable();
			selector.values = selector.getAttribute ('list').toVariable();
			var title = selector.createNode ('h2', 'choisir: '+ selector.values[0]);
			selector.callback (selector.values[0]);
			var paragraph = null;
			for (var l=0; l< selector.values.length; l++){
				paragraph = selector.createNode ('p', selector.values[l]);
				paragraph.addEventListener ('click', function (event){
					event.target.parentElement.getElementsByTagName ('h2')[0].innerHTML = 'choisir: '+ event.target.innerHTML;
					if (exists (event.target.parentElement.callback)) event.target.parentElement.callback (event.target.innerHTML);
				});
			}
			selector.removeAttribute ('callback');
			selector.removeAttribute ('list');
		});
	}
}
customElements.define ('select-db', Selector);



