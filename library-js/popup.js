/* afficher une popup (alert) stylisée
fonctionne avec la feuille de style structure.css
*/
const popupTemplate = "<popup><h2>message important</h2><button onclick='closePopup()'>X</button><div>coucou !!!</div></popup>";

function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string'){
		if (object.length ===0 || object ==="" || " \n\r\t".includes (object)) return false;
		else return true;
	}
	else return true;
}
function closePopup(){
	var popup = document.getElementsByTagName ('popup')[0];
	popup.style.display = 'none';
}
function openPopup (message, title){
	// récupérer la popup
	var popup = document.getElementsByTagName ('popup')[0];
	if (! exists (popup)){
		document.body.innerHTML = popupTemplate + document.body.innerHTML;
		popup = document.getElementsByTagName ('popup')[0];
		// style de la popup
		popup.style.position = 'fixed';
		popup.style.display = 'none';
		popup.style.gridTemplateAreas = "'a a a a a b' 'c c c c c c'";
		popup.style.backgroundColor = 'var(--page-color, white)';
		popup.style.borderStyle = 'solid';
		popup.style.borderWidth = '4px';
		popup.style.borderColor = 'var(--button-bg, #DDD)';
		popup.style.width = '50%';
		popup.style.margin = '20%';
		popup.children[0].style.gridArea = 'a';
		popup.children[0].style.padding = '0.4em';
		popup.children[0].style.color = 'var(--page-color, white)';
		popup.children[0].style.height = '2em';
		popup.children[0].style.fontSize = '1em';
		popup.children[0].style.lineHeight = '1em';
		popup.children[0].style.backgroundColor = 'var(--button-bg, #DDD)';
		popup.children[1].style.gridArea = 'b';
		popup.children[1].style.height = '2em';
		popup.children[1].style.fontSize = '1em';
		popup.children[1].style.lineHeight = '1em';
		popup.children[2].style.gridArea = 'c';
		popup.children[2].style.padding = '0.4em';
	}
	if (exists (title)) popup.children[0].innerHTML = title;
	if (exists (message)){
		if (message.constructor.name === 'String') popup.children[2].innerHTML = message;
		else if (message.constructor.name.substring (0,4) === 'HTML' && message.constructor.name.includes ('Element'))
			popup.children[2].innerHTML = message.innerHTML;
	}
	popup.style.display = 'grid';
}