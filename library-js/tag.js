// fonctions à rajouter au type HTMLElement.

function exists (object){
	if (object == null || object == undefined) return false;
	else if ((object.constructor == Array || object.constructor == HTMLCollection) && object.length ==0) return false;
	else if (typeof (object) == 'string'){
		var objectBis = object.strip();
		if (objectBis.length ==0) return false;
		else return true;
	}
	else return true;
}
HTMLElement.prototype.getById = function (id){
	let pos =-1;
	for (var i=0; i< this.children.lenght; i++) if (this.children[i].id === id) pos =i;
	if (pos <0) return null;
	else return this.children[pos];
}
HTMLElement.prototype.getByTag = function (tagName){
	let items =[];
	for (var i=0; i< this.children.lenght; i++) if (this.children[i].tagName === tagName) items.push (this.children[i]);
	return items;
}
function createNodeSimple (tag, parent){
	var newElement = document.createElement (tag);
	if (exists (parent)){
		parent.appendChild (newElement);
		return parent.children [parent.children.length -1];
	}
	else return newElement;
}
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
HTMLElement.prototype.createNodeSimple = function (tag){
	var newElement = document.createElement (tag);
	this.appendChild (newElement);
	return this.children [this.children.length -1];
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
HTMLElement.prototype.getByContent = function (word){
	if (this.innerText.contain (word)){
		var newNode = null;
		var c=0;
		while (c< this.children.length && newNode == null){
			newNode = this.children[c].getNodeByContent (word);
			c+=1;
		}
		if (exists (newNode)) return newNode;
		else return this;
	}
	else return null;
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
	return style;
}
HTMLDocument.prototype.setStyle = function (cssCode){
	var style = this.getStyle();
	if (style.innerHTML.indexOf (cssCode) <0) style.innerHTML = style.innerHTML +'\n'+ cssCode;
}
