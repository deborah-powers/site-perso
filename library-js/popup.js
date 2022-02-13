/* afficher une popup (alert) stylisée
fonctionne avec la feuille de style structure.css et son objet popup
*/
const popupTemplate = "<popup><h2>message important</h2><button onclick='closePopup(this)'>X</button><div></div></popup>";

function closePopup (buttonClose){
	buttonClose.parentElement.style.display = 'none';
}
function openPopup (message, title){
	var popup = document.getElementsByTagName ('popup')[0];
	if (! popup || popup == undefined) document.body.innerHTML = popupTemplate + document.body.innerHTML;
	popup = document.getElementsByTagName ('popup')[0];
	if (! title || title == undefined) title = 'message important';
	popup.children[0].innerHTML = title;
	popup.children[2].innerHTML = message;
}