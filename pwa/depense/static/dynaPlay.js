var bodyTemplate = "";
var varListText =[];

function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string' && (object.length ===0 || object ==="" || " \n\r\t".includes (object))) return false;
	else return true;
}
function getValueFromName (varName){
	var varValue = null;
	if (! varName.includes ('.')) varValue = window[varName];
	else{
		var listName = varName.split ('.');
		varValue = window[listName[0]][listName[1]];
		for (var w=2; w< listName.length; w++) varValue = varValue[listName[w]];
	}
	if (varValue == undefined) varValue = null;
	return varValue;
}
function setValueFromName (varName, varValue){
	if (varValue == undefined) varValue = null;
	if (! varName.includes ('.')){
		if (varValue.constructor.name != 'Array' && window[varName].constructor.name == 'Array') window[varName].push (varValue);
		else window[varName] = varValue;
	}
	else{
		var listName = varName.split ('.');
		if (listName.length ==2) window[listName[0]][listName[1]] = varValue;
		else if (listName.length ==3) window[listName[0]][listName[1]][listName[2]] = varValue;
		else if (listName.length ==4) window[listName[0]][listName[1]][listName[2]][listName[3]] = varValue;
		else if (listName.length ==5) window[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]] = varValue;
		else if (listName.length ==6) window[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]][listName[5]] = varValue;
}}
HTMLElement.prototype.printList = function(){
	if (this.innerHTML.includes ('list=')) for (var c=0; c< this.children.length; c++) this.children[c].printList();
	if (this.getAttribute ('list')){
		var varName = this.getAttribute ('list');
		var varValue = getValueFromName (varName);
		this.removeAttribute ('list');
		var nodeNew = null;
		if (varValue.constructor.name == 'Array' && varValue[0].constructor.name == 'Object'){
			for (var i= varValue.length -1; i>0; i--){
				nodeNew = this.copy();
				for (var c in varValue[i]) nodeNew.printOne (c, varValue[i][c]);
			}
			for (var c in varValue[0]) this.printOne (c, varValue[0][c]);
}}}
Array.prototype.deep = function(){
	if (this.length >0 && this[0].constructor.name == 'Array'){
		var degre =1;
		degre = degre + this[0].deep();
		return degre;
	}
	else return 1;
}
HTMLElement.prototype.getByContent = function (word){
	if (this.innerHTML.includes (word)){
		var newNode = null;
		var c=0;
		while (c< this.children.length && newNode == null){
			newNode = this.children[c].getByContent (word);
			c+=1;
		}
		if (exists (newNode)) return newNode;
		else return this;
	}
	else return null;
}
HTMLElement.prototype.copy = function(){
	var newNode = this.cloneNode();
	if (this.innerHTML) newNode.innerHTML = this.innerHTML;
	if (this.value) newNode.value = this.value;
	if (this.parentNode) this.parentNode.insertBefore (newNode, this);
	return newNode;
}
HTMLElement.prototype.printOne = function (varName, varValue){
	if (varValue.constructor.name == 'Array'){
		var nodeRef = null;
		var nodeNew = null;
		var deep = varValue.deep();
		var deepTmp = deep;
		while (this.innerHTML.includes ('((' + varName + '))')){
			deepTmp = deep;
			nodeRef = this.getByContent ('((' + varName + '))');
			while (deepTmp >1){
				nodeRef = nodeRef.parentElement;
				deepTmp = deepTmp -1;
			}
			var i=0;
			for (; i< varValue.length -1; i++){
				nodeNew = nodeRef.copy();
				nodeNew.printOne (varName, varValue[i]);
			}
			nodeRef.printOne (varName, varValue[i]);
	}}
	else if (varValue.constructor.name == 'Object'){
		var nodeRef = this.getByContent ('((' + varName + '))');
		var nodeNew = null;
		for (var l in varValue) if (typeof (varValue[l]) != 'function'){
			nodeNew = nodeRef.copy (true);
			nodeNew.printOne (varName, varValue[l]);
		}
		nodeRef.remove();
	}
	else{
		this.innerHTML = this.innerHTML.replace ('(('+ varName +'))', varValue);
		for (var a=0; a< this.attributes.length; a++) if (this.attributes[a].value.includes ('((' + varName + '))'))
			this.attributes[a].value = this.attributes[a].value.replace ('((' + varName + '))', varValue);
}}
HTMLSelectElement.prototype.printOne = function(){
	if (exists (this.name)){
		var varValue = getValueFromName (this.name);
		if (exists (varValue)){
			if (varValue.constructor.name == 'Array') this.setAttribute ('value', varValue[0]);
			else if (varValue.constructor.name != 'Object') this.setAttribute ('value', varValue);
			this.addEventListener ('change', function (event){
				setValueFromName (event.target.name, event.target.options [event.target.selectedIndex].value);
				document.body.innerHTML = bodyTemplate;
				dpLoad();
			});
}}}
HTMLInputElement.prototype.printOne = function(){
	if (exists (this.name)){
		var varValue = getValueFromName (this.name);
		if (exists (varValue)){
			if (varValue.constructor.name == 'Array') this.setAttribute ('value', varValue[0]);
			else if (varValue.constructor.name != 'Object') this.setAttribute ('value', varValue);
			this.addEventListener ('change', function (event){
				setValueFromName (event.target.name, event.target.value);
				document.body.innerHTML = bodyTemplate;
				dpLoad();
			});
}}}
function dpLoad(){
	// affichage des listes
	for (var v=0; v< document.body.children.length; v++) document.body.children[v].printList();
	// affichage basique
	for (var v=0; v< varListText.length; v++){
		var varValue = getValueFromName (varListText[v]);
		document.body.printOne (varListText[v], varValue);
	}
	// affichage des inputs
	var inputList = document.getElementsByTagName ('input');
	for (var v=0; v< inputList.length; v++) inputList[v].printOne();
	inputList = document.getElementsByTagName ('textarea');
	for (var v=0; v< inputList.length; v++) inputList[v].printOne();
}

String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
String.prototype.clean = function(){
	var text = this.replace ('\r');
	text = text.replace ('\n'," ");
	text = text.replace ('\t'," ");
	while (text.includes ('  ')) text = text.replace ('  ', ' ');
	if (text[0] ===" ") text = text.slice (1);
	if (text [text.length -1] ===" ") text = text.slice (0, text.length -1);
	text = text.replace ('<br>', '<br/>');
	text = text.replace ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replace ('<br/><br/>', '<br/>');
	text = text.replace ('<br/><', '<');
	text = text.replace ('><br/>', '>');
	text = text.replace ('<span></span>');
	text = text.replace ('<p></p>');
	text = text.replace ('<div></div>');
	return text;
}
HTMLElement.prototype.listList = function(){
	var varName = this.getAttribute ('list');
	if (exists (varName) && getValueFromName (varName) && varListList.indexOf (varName) <0) varListList.push (varName);
	for (var c=0; c< this.children.length; c++) this.children[c].listList();
}
function dpInit(){
	// nettoyer le texte
	document.body.innerHTML = document.body.innerHTML.clean();
	document.body.innerHTML = document.body.innerHTML.replace ('(( ', '((');
	document.body.innerHTML = document.body.innerHTML.replace (' ))', '))');
	bodyTemplate = document.body.innerHTML;
	// affichage basique
	var f=0;
	var varName ="";
	var varValue ="";
	const bodyTmp = document.body.innerHTML.split ('((');
	for (var v=1; v< bodyTmp.length; v++){
		f= bodyTmp[v].indexOf ('))');
		varName = bodyTmp[v].slice (0,f);
		varValue = getValueFromName (varName);
		if (varListText.indexOf (varName) <0 && exists (varValue)) varListText.push (varName);
	}
	dpLoad();
}
