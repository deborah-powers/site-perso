String.prototype.clean = function(){
	tabText = this.split ('\r');
	var text = tabText.join ("");
	var tabText = null;
	while (text.indexOf ('  ') >=0){
		tabText = text.split ('  ');
		text = tabText.join (' ');
	}
	tabText = text.split ('\n '); text = tabText.join ('\n');
	tabText = text.split (' \n'); text = tabText.join ('\n');
	while (text.indexOf ('\t\t') >=0){
		tabText = text.split ('\t\t');
		text = tabText.join ('\t');
	}
	tabText = text.split ('\t\n'); text = tabText.join ('\n');
	while (text.indexOf ('\n\n') >=0){
		tabText = text.split ('\n\n');
		text = tabText.join ('\n');
	}
	var toStrip = '\n \t/';
	while (toStrip.indexOf (text[0]) >=0) text = text.slice (1);
	while (toStrip.indexOf (text [text.length -1]) >=0) text = text.slice (0, text.length -1);
	return text;
}
function exists (object){
	if (object == null || object == undefined) return false;
	else if ((object.constructor == Array || object.constructor == HTMLCollection) && object.length ==0) return false;
	else if (typeof (object) == 'string'){
		var objectBis = object.clean();
		if (objectBis.length ==0) return false;
		else return true;
	}
	else return true;
}
String.prototype.toVariable = function (container){
	if (! exists (container)) container = window;
	var id = this.indexOf ('.');
	if (id<0) return container [this];
	else{
		var name = this.slice (0,id);
		var end = this.slice (id+1);
		return end.toVariable (container[name]);
	}
}
String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
String.prototype.addZero = function(){
	if (this.length >=2) return this;
	else return '0'+ this;
}
Number.prototype.addZero = function(){
	var nb= this.toString();
	nb= nb.addZero();
	return nb;
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
function setStyle (cssCode){
	cssCode = cssCode.clean();
	var styleList = document.head.getElementsByTagName ('style');
	var style = null;
	if (exists (styleList)){
		style = styleList[0];
		if (style.innerHTML.indexOf (cssCode) <0) style.innerHTML = style.innerHTML +'\n'+ cssCode;
	}
	else{
		style = document.head.createNode ('style');
		style.setAttribute ('type', 'text/css');
		style.innerHTML +'\n'+ cssCode;
	}
}




