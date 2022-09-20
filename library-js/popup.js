/* afficher une popup (alert) stylisée
fonctionne avec les feuilles de style structure.css et popup.css
*/
const popupTemplate = "<h2>message important</h2><button onclick='closePopup(this)'>X</button><div></div>";

popup > h2 {
	grid-area: a;
	height: 3em;
	margin: 0;
	color: var(--page-color, white);
}
popup > button {
	grid-area: b;
	height: 3em;
	border-top-right-radius: 2em;
	color: var(--page-color, white);
	background: none;
}
popup > button:hover { background-color: var(--text-color); }
popup > div {
	grid-area: c;
	margin: 1em;
}

class Popup extends HTMLDivElement{
	constructor(){
		super();
		this.title ="";
		this.message = null;
	}
	connectedCallback(){
		this.innerHTML + popupTemplate;
		this.style.position = 'fixed';
		this.style.display = 'grid';
		console.log (this.style);
	}
	close = function(){ this.style.display = 'none'; }
	open = function(){ this.style.display = 'grid'; }
}
/*
popup {
	grid-template-areas: 'a a a a a b' 'c c c c c c';
	margin: 15%;
	width: 50%;
	border-radius: 2em;
	border-style: solid;
	border-width: 4px;
	background: linear-gradient(var(--bord-color) 3em, var(--page-color, white) 3em);
}
const popupTemplate = "<popup><h2>message important</h2><button onclick='closePopup(this)'>X</button><div></div></popup>";

function closePopup (buttonClose){
	buttonClose.parentElement.style.display = 'none';
}
function openPopup (message, title){
	var popup = document.getElementsByTagName ('popup')[0];
	if (! popup || popup == undefined){
		document.body.innerHTML = popupTemplate + document.body.innerHTML;
		popup = document.getElementsByTagName ('popup')[0];
	}
	if (! title || title == undefined) title = 'message important';
	popup.children[0].innerHTML = title;
	popup.children[2].innerHTML = message;
}*/