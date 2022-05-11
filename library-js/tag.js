// fonctions à rajouter au type HTMLElement. dépend de text.js pour la gestion du style de la page.

function createNode (tag, text, parent, id, clazz, value){
	var newElement = document.createElement (tag);
	if (text) newElement.innerHTML = text;
	if (clazz) newElement.className = clazz;
	if (id) newElement.id = id;
	if (value) newElement.value = value;
	if (parent){
		parent.appendChild (newElement);
		return parent.children [parent.children.length -1];
	}
	else return newElement;
}
function createInput (type, value, parent, id, clazz, placeholder){
	var newElement = createNode ('input', null, parent, clazz, id, value);
	if (! type) type = 'text';
	newElement.type = type;
	if (placeholder) newElement.placeholder = placeholder;
	return parent.children [parent.children.length -1];
}
HTMLElement.prototype.copy = function (bind){
	var newNode = this.cloneNode();
	if (this.innerHTML) newNode.innerHTML = this.innerHTML;
	if (this.value) newNode.value = this.value;
	if (this.placeholder) newNode.placeholder = this.placeholder;
	if (this.type) newNode.type = this.type;
	if (this.parentNode && bind) this.parentNode.insertBefore (newNode, this);
	return newNode;
}
HTMLElement.prototype.createNode = function (tag, text, id, clazz, value){
	var newElement = document.createElement (tag);
	if (text) newElement.innerHTML = text;
	if (clazz) newElement.className = clazz;
	if (id) newElement.id = id;
	if (value) newElement.value = value;
	this.appendChild (newElement);
	return this.children [this.children.length -1];
}
HTMLElement.prototype.createInput = function (type, value, id, clazz, placeholder){
	var newElement = this.createNode ('input', null, clazz, id, value);
	if (! type) type = 'text';
	newElement.type = type;
	return newElement;
}
// le style de la page
HTMLDocument.prototype.getStyle = function(){
	var styleList = document.head.getElementsByTagName ('style');
	var style = null;
	if (exists (styleList)) style = styleList[0];
	else{
		style = document.head.createNode ('style');
		style.setAttribute ('type', 'text/css');
	}
	style.innerHTML = style.innerHTML.clean();
	return style;
}
HTMLDocument.prototype.setStyleNokey = function (cssCode){
	var style = this.getStyle();
	cssCode = cssCode.clean();
	style.innerHTML = style.innerHTML +'\n'+ cssCode;
}
HTMLDocument.prototype.setStyle = function (cssCode){
	console.log ('a');
	var style = this.getStyle();
	console.log ('b', style.innerHTML);
	cssCode = cssCode.clean();
	if (style.innerHTML.indexOf (cssCode) <0) style.innerHTML = style.innerHTML +'\n'+ cssCode;
}
