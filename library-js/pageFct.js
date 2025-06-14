/* nettoyer une page web
dépend de textFct.js et htmlFct.js
fonctionne avec cleanAction.js
*/
const urlBackend = 'http://localhost:1407/';

function sendToBackend(){
	// récupérer les métadonnées
	const data = {
		title: 'nouvel article',
		link: window.location.href,
		body: document.body.innerHTML
	};
	const title = document.head.getElementsByTagName ('title')[0].innerHTML.toLowerCase().clean();
	if (exists (title)) data.title = title;
	// ecrire le body propre dans un fichier grâce à un backend python
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (this.readyState ===4 && this.status === 200) console.log ("les données ont bien été envoyées au back-end.\nsa réponse:", this.responseText);
		else console.log ("l'échange avec le back-end est en erreur.\nécoute-il sur le port 1407 ?\nétat =", this.readyState, 'status =', this.status);
	};
	xhttp.open ('POST', urlBackend, true);
	xhttp.send (JSON.stringify (data));
}
function downloadFile (fileName, fileText){
	const style =`<style type='text/css'>
a#download-article { display: block; position: fixed; bottom: 0; right: 0; z-index: 10; border-width: 8px; border-style: double; padding: 1em; border-radius: 1em; }
a#download-article.moved { bottom: unset; top: 0; }
</style>`;
	const fileTextEncoded = encodeURIComponent (fileText);
	var downloadBloc =`<a id='download-article' onmouseleave="if ('moved' === this.className) this.className =''; else this.className = 'moved'" download='$fileName' href="data:text/plain;charset=utf-8,$texte">
télécharger l'article</a>`;
	const downloadLinkText =`<a id='download-article' onmouseleave="if (this.className.includes ('moved')) this.className =''; else this.className = 'moved'" download='` + fileName +`' href="data:text/plain;charset=utf-8,` + fileTextEncoded +`">
télécharger le fichier</a>`;
	downloadBloc = downloadBloc.replace ('$fileName', fileName);
	downloadBloc = downloadBloc.replace ('$text', fileTextEncoded);
	document.head.innerHTML = document.head.innerHTML + style;
	document.body.innerHTML = downloadLinkText + document.body.innerHTML;
}
function downloadFileFromButton (fileName, fileText){
	const downloadLink = document.createElement ('a');
	downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent (fileText);
	downloadLink.setAttribute ('download', fileName);
	downloadLink.click();
}
Element.prototype.removeComments = function(){
	if (this.innerHTML.includes ('<!--')){
		var f=0;
		const textList = this.innerHTML.split ('<!--');
		for (var l=1; l< textList.length; l++){
			f=3+ textList[l].indexOf ('-->');
			if (f>2) textList[l] = textList[l].substring (f);
		}
		const text = textList.join ("");
		this.innerHTML = text;
}}
HTMLElement.prototype.simplifyNesting = function(){
	if ([ 'SCRIPT', 'NOSCRIPT', 'STYLE', 'HEADER', 'FOOTER' ].includes (this.tagName)) this.parentElement.removeChild (this);
	else if (! [ 'IMG', 'BR', 'HR', 'INPUT', 'TEXTAREA', 'svg' ].includes (this.tagName)){
		for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting();
		if (this.innerHTML.isEmpty()) this.parentElement.removeChild (this);
		else if (this.innerText.isEmpty() && this.children.length ===0) this.parentElement.removeChild (this);
		else if (this.innerText.isEmpty() &&! this.innerHTML.includes ('<img') &&! this.innerHTML.includes ('<svg'))
			this.parentElement.removeChild (this);
		else if (this.children.length ===1 && this.childNodes.length ===1){
			if ([ 'A', 'XMP', 'IMG', 'BR', 'HR', 'INPUT', 'TEXTAREA', 'svg' ].includes (this.children[0].tagName)){
				this.parentElement.insertBefore (this.children[0], this);
				this.parentElement.removeChild (this);
			}
			else this.innerHTML = this.children[0].innerHTML;
}}}
Element.prototype.simplifyNesting = function(){ return; }
HTMLPreElement.prototype.simplifyNesting = function(){
	// pour les éléments xmp
	this.delAttributes();
	this.delIds();
	var text = this.innerHTML.cleanBasic();
	text = text.replaceAll ('<span>',"");
	text = text.replaceAll ('</span>',"");
	text = text.replaceAll ('<xmp>',"");
	text = text.replaceAll ('</xmp>',"");
	if (text.includes ('<span ')){
		var textList = text.split ('<span ');
		for (var t=1; t< textList.length; t++){
			d=1+ textList[t].indexOf ('>');
			textList[t] = textList[t].substring (d);
		}
		text = textList.join ("");
	}
	if (text.includes ('<xmp ')){
		var textList = text.split ('<xmp ');
		for (var t=1; t< textList.length; t++){
			d=1+ textList[t].indexOf ('>');
			textList[t] = textList[t].substring (d);
		}
		text = textList.join ("");
	}
	// mettre le texte en forme
	text = text.replaceAll ('\t', " ");
	text = text.replaceAll ('\n', " ");
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	const artefactsAddSpace =[ [' >','>'], ['< ','<'], [';','; '], [')',') '], ['{','{ '], ['}',' }'], ['(',' ('] ];
	const artefactsDelSpace =[ [' {', '{'], ['( ','('], [' )',')'], [' ()','()'], [' .','.'], [' ,',','], [' ;',';'] ];
	for (var art of artefactsAddSpace) text = text.replaceAll (art[0], art[1]);
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	for (var art of artefactsDelSpace) text = text.replaceAll (art[0], art[1]);
	this.innerHTML = text;
	this.computeWidth();
}
HTMLSelectElement.prototype.simplifyNesting = function(){
	if (this.textContent.isEmpty() && ! this.innerHTML.includes ('<img') && ! this.innerHTML.includes ('<svg')) this.parentElement.removeChild (this);
	else{ for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting(); }
}
HTMLTableElement.prototype.simplifyNesting = function(){
	if (this.innerText.isEmpty() && ! this.innerHTML.includes ('<img') && ! this.innerHTML.includes ('<svg')) this.parentElement.removeChild (this);
	else{
		for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting();
		var newText ="";
		for (var c=0; c< this.children.length; c++){
			if (this.children[c].tagName === 'TR' || this.children[c].tagName === 'CAPTION') newText = newText + this.children[c].outerHTML;
			else newText = newText + this.children[c].innerHTML;
		}
		this.innerHTML = newText;
}}
HTMLTableSectionElement.prototype.simplifyNesting = function(){
	if (this.innerText.isEmpty() && ! this.innerHTML.includes ('<img') && ! this.innerHTML.includes ('<svg')) this.parentElement.removeChild (this);
	else{ for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting(); }
}
HTMLTableRowElement.prototype.simplifyNesting = function(){
	if (this.innerText.isEmpty() && ! this.innerHTML.includes ('<img') && ! this.innerHTML.includes ('<svg')) this.parentElement.removeChild (this);
	else{ for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting(); }
}
HTMLTableCellElement.prototype.simplifyNesting = function(){
	for (var c= this.children.length -1; c>=0; c--) this.children[c].simplifyNesting();
}
// est-ce que je conserve la classe et l'id ?
Element.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id class'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
	}
	for (var c=0; c< this.children.length; c++) this.children[c].delAttributes();
}
SVGSVGElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if ([ 'id', 'class', 'viewBox', 'version' ].includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
}}
HTMLImageElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id src alt'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
}}
HTMLInputElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id type name value'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
}}
HTMLSelectElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id name onchange'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
}}
HTMLOptionElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'value'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
}}
HTMLAnchorElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id class href'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
	}
	for (var c=0; c< this.children.length; c++) this.children[c].delAttributes();
}
HTMLFormElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'id action method'.includes (this.attributes[a].name)){
		this.removeAttribute (this.attributes[a].name);
	}
	for (var c=0; c< this.children.length; c++) this.children[c].delAttributes();
}
HTMLButtonElement.prototype.delAttributes = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (this.attributes[a].name != 'onclick'){
		this.removeAttribute (this.attributes[a].name);
	}
	for (var c=0; c< this.children.length; c++) this.children[c].delAttributes();
}
Element.prototype.delIds = function(){
	this.removeAttribute ('class');
	this.removeAttribute ('id');
	for (var c=0; c< this.children.length; c++) this.children[c].delIds();
}
SVGSVGElement.prototype.delIds = function(){
	this.removeAttribute ('class');
	this.removeAttribute ('id');
}
HTMLElement.prototype.findTag = function (tagName){
	var container = this.getElementsByTagName (tagName)[0];
	if (! exists (container)) container = document.getElementById (tagName);
	if (! exists (container)) container = this.getElementsByClassName (tagName)[0];
	if (exists (container)) return container;
	else return null;
}
HTMLElement.prototype.replaceTag = function (tagName){
	const container = this.findTag (tagName);
	if (container === null || [ 'BR', 'HR' ].includes (container.tagName)) return;
	else if ([ 'A', 'IMG', 'INPUT', 'TEXTAREA', 'svg' ].includes (container.tagName)){
		if (this.tagName === 'BODY') this.innerHTML = container.outerHTML;
		else{
			this.parentElement.insertBefore (container, this);
			this.parentElement.removeChild (this);
	}}
	else this.innerHTML = container.innerHTML;
}
HTMLElement.prototype.findTagList = function (tagName){
	var containerList = this.getElementsByTagName (tagName);
	if (containerList.length ===0) containerList = this.getElementsByClassName (tagName);
	if (containerList.length ===0) containerList = this.getElementById (tagName);
	return containerList;
}
HTMLElement.prototype.replaceTagList = function (tagName){
	const containerList = this.findTagList (tagName);
	if (containerList.length ===0) return;
	else if (containerList.length ===1 && [ 'BR', 'HR' ].includes (containerList[0].tagName)) return;
	else if (containerList.length ===1 && [ 'A', 'IMG', 'INPUT', 'TEXTAREA', 'svg' ].includes (containerList[0].tagName)){
		if (this.tagName === 'BODY') this.innerHTML = containerList[0].outerHTML;
		else{
			this.parentElement.insertBefore (containerList[0], this);
			this.parentElement.removeChild (this);
	}}
	else if (containerList.length ===1) this.innerHTML = containerList[0].innerHTML;
	else{
		this.innerHTML = containerList[0].outerHTML;
		for (var c=1; c< containerList.length; c++) this.innerHTML = this.innerHTML + containerList[c].outerHTML;
}}
HTMLBodyElement.prototype.cleanBody = function(){
	this.innerHTML = this.innerHTML.cleanHtml();
//	const codeBlocs = document.getElementsByTagName ('xmp');
//	for (var b=0; b< codeBlocs.length; b++) codeBlocs[b].simplifyNesting();
	this.replaceTag ('main');
	if (this.innerHTML.count ('</article>') ===1) this.replaceTag ('article');
	this.removeComments();
	for (var a= this.attributes.length -1; a>=0; a--) this.removeAttribute (this.attributes[a].name);
	this.simplifyNesting();
	this.delAttributes();
}
