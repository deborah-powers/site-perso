function exists (object){
	if (object == null || object == undefined) return false;
	else if ((object.constructor == Array || object.constructor == HTMLCollection) && object.length ==0) return false;
	else if (typeof (object) == 'string'){
		if (object.length ==0 || object =="" || object ==" " || object =="\n" || object =="\t" || object =="\r") return false;
		else return true;
	}
	else return true;
}
String.prototype.index = function (word, pos){
	if (pos == null || pos == undefined) pos =0;
	var posReal = this.indexOf (word, pos);
	if (posReal <0 && word.includes ('"')){
		word = word.replace ('"', "'");
		posReal = this.indexOf (word, pos);
	}
	else if (posReal <0 && word.includes ("'")){
		word = word.replace ("'", '"');
		posReal = this.indexOf (word, pos);
	}
	return posReal;
}
String.prototype.count = function (word){
	if (! this.includes (word)) return 0;
	var pos =0, nb=0;
	while (pos >=0){
		pos = this.index (word, pos);
		if (pos <0) break;
		pos +=1; nb +=1;
	}
	return nb;
}
String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
String.prototype.strip = function(){
	var toStrip = '\n \t/';
	var text = this;
	var i=0, j=1;
	while (toStrip.index (text[0]) >=0) text = text.slice (1);
	while (toStrip.index (text [text.length -1]) >=0) text = text.slice (0, text.length -1);
	return text;
}
String.prototype.clean = function(){
	var text = this.replace ('\r');
	text = text.replace ('\n');
	text = text.replace ('\t');
	text = text.strip();
	while (text.includes ('  ')) text = text.replace ('  ', ' ');
	text = text.replace ('> ','>');
	text = text.replace (' <','<');
	/*
	text = text.replace ('<a ',' <a ');
	text = text.replace ('</a>','</a> ');
	text = text.replace ('> <','><');
	*/
	return text;
}
String.prototype.cleanEmptyTags = function(){
	var text = this.replace ('<br>', '<br/>');
	text = text.replace ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replace ('<br/><br/>', '<br/>');
	text = text.replace ('<br/><', '<');
	text = text.replace ('><br/>', '>');
	text = text.replace ('<br/>', '</p><p>');
	text = text.replace ('<span></span>');
	text = text.replace ('<p></p>');
	text = text.replace ('<div></div>');
	return text;
}
HTMLElement.prototype.clean = function(){
	// éliminer les commentaires
	for (var c= this.childNodes.length -1; c>=0; c--){
		if (this.childNodes[c].constructor.name === 'Comment') this.removeChild (this.childNodes[c]);
		else if (this.childNodes[c].constructor.name === 'Text' && this.childNodes[c].length <2
				&& ! "0123456789abcdefghijklmnopqrstuvwxyz.:;,!?".includes (this.childNodes[c].textContent))
			this.removeChild (this.childNodes[c]);
	}
	// éliminer les blocs inutiles
	for (var c= this.children.length -1; c>=0; c--){
		if (this.children[c].tagName == 'SCRIPT' || this.children[c].tagName == 'NOSCRIPT'
			|| this.children[c].tagName == 'HEADER' || this.children[c].tagName == 'FOOTER')
			this.removeChild (this.children[c]);
		else if (! exists (this.children[c].innerHTML) && ! "A IMG BR HR INPUT".includes (this.children[c].tagName))
			this.removeChild (this.children[c]);
	}
	// simplifier les emboîtements
	if (this.children.length ===1 && this.childNodes.length ===1){
		if ("A IMG BR HR INPUT svg".includes (this.children[0].tagName)){
			this.parentElement.insertBefore (this.children[0], this);
			this.parentElement.removeChild (this);
		}
		else this.innerHTML = this.children[0].innerHTML;
	}
	for (var c=0; c< this.children.length; c++) this.children[c].clean();
}
HTMLImageElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (this.attributes[a].name != 'src' && this.attributes[a].name != 'alt')
		this.removeAttribute (this.attributes[a].name);
}
HTMLInputElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'type name value id'.includes (this.attributes[a].name))
		this.removeAttribute (this.attributes[a].name);
}
HTMLElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) this.removeAttribute (this.attributes[a].name);
	for (var c=0; c< this.children.length; c++) this.children[c].delAttribute();
}
HTMLAnchorElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (this.attributes[a].name != 'href')
		this.removeAttribute (this.attributes[a].name);
	for (var c=0; c< this.children.length; c++) this.children[c].delAttribute();
}
HTMLFormElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (! 'action method'.includes (this.attributes[a].name))
		this.removeAttribute (this.attributes[a].name);
	for (var c=0; c< this.children.length; c++) this.children[c].delAttribute();
}
HTMLButtonElement.prototype.delAttribute = function(){
	for (var a= this.attributes.length -1; a>=0; a--) if (this.attributes[a].name != 'onclick')
		this.removeAttribute (this.attributes[a].name);
	for (var c=0; c< this.children.length; c++) this.children[c].delAttribute();
}
HTMLElement.prototype.findTag = function (tagName){
	var container = this.getElementsByTagName (tagName)[0];
	if (exists (container)) this.innerHTML = container.innerHTML;
	container = this.getElementsByClassName (tagName)[0];
	if (exists (container)) this.innerHTML = container.innerHTML;
	container = document.getElementById (tagName);
	if (exists (container)) this.innerHTML = container.innerHTML;
}
HTMLBodyElement.prototype.cleanBody = function(){
	this.innerHTML = this.innerHTML.clean();
	this.findTag ('main');
	if (this.innerHTML.count ('</article>') ===1) this.findTag ('article');
	for (var a= this.attributes.length -1; a>=0; a--) this.removeAttribute (this.attributes[a].name);
	this.clean();
	this.innerHTML = this.innerHTML.cleanEmptyTags();
}