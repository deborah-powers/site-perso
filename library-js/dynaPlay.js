HTMLElement.prototype.originalHtml ="";
HTMLElement.prototype.originalAttributes ={};
var dicoPlay ={};

function exists (object){
	if (object === null || object === undefined) return false;
	else if ((object.constructor === Array || object.constructor === HTMLCollection) && object.length ===0) return false;
	else if (typeof (object) == 'string' && (object.length ===0 || object ==="" || " \n\r\t".includes (object))) return false;
	else return true;
}
function setValueFromName (varName, varValue){
	if (varValue == undefined) varValue = null;
	if (! varName.includes ('.')){
		if (dicoPlay[varName].constructor.name === 'Array' && varValue.constructor.name === dicoPlay[varName][0].constructor.name)
			dicoPlay[varName].push (varValue);
		else if (dicoPlay[varName].constructor.name === varValue.constructor.name) dicoPlay[varName] = varValue;
		else if (! 'Object Array'.includes (dicoPlay[varName].constructor.name) && ! 'Object Array'.includes (varValue.constructor.name))
			dicoPlay[varName] = varValue;
	}
	else{
		var listName = varName.split ('.');
		if (listName.length ==2) window[listName[0]][listName[1]] = varValue;
		else if (listName.length ==3) window[listName[0]][listName[1]][listName[2]] = varValue;
		else if (listName.length ==4) window[listName[0]][listName[1]][listName[2]][listName[3]] = varValue;
		else if (listName.length ==5) window[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]] = varValue;
		else if (listName.length ==6) window[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]][listName[5]] = varValue;
}}
HTMLElement.prototype.print = function (varName, varValue){
	if (this.outerHTML.includes (varName) && this.tagName !== 'SCRIPT' && varValue.constructor.name !== 'Function'){
		for (var c=0; c< this.children.length; c++) this.children[c].print (varName, varValue);
		this.printCondition();
		this.printFor (varName, varValue);
		if ('Number String'.includes (varValue.constructor.name)) for (var a= this.attributes.length -1; a>=0; a--)
			this.attributes[a].value = printSimple (varName, varValue, this.attributes[a].value);
		else if (varValue.constructor === Array) this.printList (varName, varValue);
		if (this.innerHTML.includes ('((' + varName + '))')){
			if (varValue.constructor === Object) this.printObject (varName, varValue);
			else this.innerHTML = printSimple (varName, varValue, this.innerHTML);
		}
		if (this.innerHTML.includes ('((' + varName + '.') && varValue.constructor === Object)
			for (var item in varValue) if (item.constructor.name !== 'Function') this.print (varName +'.'+ item, varValue[item]);
	//	else console.log (varName, varValue, "autre", this.tagName);
		if ('(('+ varName +'))' === this.getAttribute ('value') && 'Number String'.includes (varValue.constructor.name)) this.setAttribute ('value', varValue);
}}
function printSimple (varName, varValue, template){
	if ('Number String'.includes (varValue.constructor.name)){
		if (varValue.constructor.name === 'Number' && varValue %1 >0){
			varValue = varValue.toFixed (3);
			while (varValue [varValue.length -1] === '0') varValue = varValue.substring (0, varValue.length -1);
		}
		template = template.replaceAll ('((' + varName + '))', varValue);
	}
	return template;
}
HTMLElement.prototype.printObject = function (varName, varValue){
	if (this.getByContent (varName)){
		newValue =[];
		for (var v in varValue) if (v !== 'fill') newValue.push (v+ ': '+ varValue[v]);
		this.printList (varName, newValue);
}}
HTMLElement.prototype.printFor = function (varName, varValue){
	if (exists (this.getAttribute ('for')) && this.getAttribute ('for') === varName && varValue.constructor === Array){
		this.removeAttribute ('for');
		var i=0;
		if ('String Number'.includes (varValue[0].constructor.name)){
			for (; i< varValue.length -1; i++){
				nodeNew = this.copy();
				nodeNew.innerHTML = printSimple ("", varValue[i], nodeNew.innerHTML);
				for (var a= nodeNew.attributes.length -1; a>=0; a--) nodeNew.attributes[a].value = printSimple ("", varValue[i], nodeNew.attributes[a].value);
			}
			this.innerHTML = printSimple ("", varValue[i], this.innerHTML);
			for (var a= this.attributes.length -1; a>=0; a--) this.attributes[a].value = printSimple ("", varValue[i], this.attributes[a].value);
		}
		else if (varValue[0].constructor.name === 'Object'){
			for (; i< varValue.length -1; i++){
				nodeNew = this.copy();
				for (var item in varValue[i]) nodeNew.print (item, varValue[i][item]);
			}
			for (var item in varValue[i]) this.print (item, varValue[i][item]);
}}}
HTMLElement.prototype.printList = function (varName, varValue){
	var nodeRef = this.getByContent ('((' + varName + '))');
	if (nodeRef){
		var nodeNew = null;
		var deep = varValue.deep();
		var deepTmp = deep;
		while (deepTmp >1){
			nodeRef = nodeRef.parentElement;
			deepTmp = deepTmp -1;
		}
		var i=0;
		for (; i< varValue.length -1; i++){
			nodeNew = nodeRef.copy();
			nodeNew.print (varName, varValue[i]);
		}
		nodeRef.print (varName, varValue[i]);
}}
Array.prototype.deep = function(){
	if (this.length >0 && this[0].constructor === Array){
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
		if (newNode) return newNode;
		else return this;
	}
	else if (this.outerHTML.includes (word)) return this;
	else return null;
}
HTMLTextAreaElement.prototype.print = function (varName, varValue){
	if (exists (this.getAttribute ('name')) && this.getAttribute ('name') === varName){
		if (varValue.constructor === Array) this.value = varValue.join ('\n');
		else if (varValue.constructor === Object){
			var text ="";
			for (var v in varValue) text = text +v+': '+ varValue[v] +'\n';
			this.value = text;
		}
		else this.value = varValue;
		this.addEventListener ('change', function (event){
			document.body.innerHTML = bodyTemplate;
			setValueFromName (event.target.name, event.target.value);
			dpLoad();
		});
}}
HTMLSelectElement.prototype.setChoice = function (choiceId){
	this.selectedIndex = choiceId;
	this.selectedOptons =[ this.options [choiceId], ];
	this.value = this.options [choiceId].value;
}
HTMLSelectElement.prototype.print = function (varName, varValue){
	if (exists (this.getAttribute ('name')) && this.getAttribute ('name') === varName){
		var valeurExist = false;
		for (var o=0; o< this.options.length; o++) if (varValue === this.options[o].value){
			this.selectedIndex = this.options[o].index;
			valeurExist = true;
		}
		if (! valeurExist) setValueFromName (varName, this.value);
		this.addEventListener ('change', function (event){
			document.body.innerHTML = bodyTemplate;
			setValueFromName (event.target.name, event.target.options [event.target.selectedIndex].value);
			var callback = this.getAttribute ('callback');
			if (exists (callback)) window [callback] (event.target.options [event.target.selectedIndex].value);
			dpLoad();
		});
}}
HTMLInputElement.prototype.print = function (varName, varValue){
	if (exists (this.getAttribute ('name')) && this.getAttribute ('name') === varName){
		if ('radio checkbox'.includes (this.type) && this.value === varValue) this.checked = true;
		else if (varValue.constructor.name === 'Array' && this.type !== 'radio'){
			this.setAttribute ('type', 'radio');
			this.name = this.value;
			var nodeNew;
			var label;
			var i=0;
			for (; i< varValue.length -1; i++){
				nodeNew = this.copy();
				nodeNew.setAttribute ('value', varValue[i]);
				nodeNew.addEventListener ('change', function (event){
					if (event.target.checked){
						document.body.innerHTML = bodyTemplate;
						setValueFromName (event.target.name, event.target.value);
						dpLoad();
				}});
				label = document.createElement ('span');
				label.innerHTML = varValue[i];
				this.parentElement.insertBefore (nodeNew, this);
				this.parentElement.insertBefore (label, nodeNew);
			}
			this.setAttribute ('value', varValue[i]);
			this.addEventListener ('change', function (event){
				if (event.target.checked){
					document.body.innerHTML = bodyTemplate;
					setValueFromName (event.target.name, event.target.value);
					dpLoad();
			}});
			label = document.createElement ('span');
			label.innerHTML = varValue[i];
			this.parentElement.insertBefore (label, this);
		}
		else if (! 'Object Array'.includes (varValue.constructor.name) &&! 'radio checkbox'.includes (this.type)){
			this.setAttribute ('value', varValue);
			this.addEventListener ('change', function (event){
				document.body.innerHTML = bodyTemplate;
				setValueFromName (event.target.name, event.target.value);
				dpLoad();
			});}
}}
HTMLElement.prototype.copy = function(){
	var newNode = this.cloneNode();
	if (this.innerHTML) newNode.innerHTML = this.innerHTML;
	if (this.value) newNode.value = this.value;
	if (this.className) newNode.className = this.className;
	if (this.parentNode) this.parentNode.insertBefore (newNode, this);
	return newNode;
}
HTMLElement.prototype.printCondition = function(){
	if (this.getAttribute ('if')){
		var printBlock = eval (this.getAttribute ('if'));
		if (printBlock) for (var c=0; c< this.children.length; c++) this.children[c].printCondition();
		else this.style.display = 'none';
	}
	else if (this.innerHTML.includes ('if=')) for (var c=0; c< this.children.length; c++) this.children[c].printCondition();
}
Object.prototype.fill = function (objRef){ for (var f in objRef) if (! this[f]) this[f] = objRef[f]; }
String.prototype.cleanHtml = function(){
	var text = this.replaceAll ('\r', "");
	text = text.replaceAll ('\n'," ");
	text = text.replaceAll ('\t'," ");
	while (text.includes ('  ')) text = text.replaceAll ('  ', ' ');
	if (text[0] ===" ") text = text.slice (1);
	if (text [text.length -1] ===" ") text = text.slice (0, text.length -1);
	text = text.replaceAll ('<br>', '<br/>');
	text = text.replaceAll ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replaceAll ('<br/><br/>', '<br/>');
	text = text.replaceAll ('<br/><', '<');
	text = text.replaceAll ('><br/>', '>');
	text = text.replaceAll ('<span></span>', "");
	text = text.replaceAll ('<p></p>', "");
	text = text.replaceAll ('<div></div>', "");
	text = text.replaceAll ('(( ', '((');
	text = text.replaceAll (' ))', '))');
	return text;
}
HTMLElement.prototype.initAjax = function(){
	if (this.innerHTML.includes ('((')){ for (var c=0; c< this.children.length; c++) this.children[c].initAjax(); }
	if (this.getAttribute ('aria-live')){
		if (this.innerHTML.includes ('((')) this.originalHtml = this.innerHTML;
		for (var a=0; a< this.attributes.length; a++){
			if (this.attributes[a].value.includes ('((')) this.originalAttributes [this.attributes[a].name] = this.attributes[a].value;
}}}
HTMLElement.prototype.reload = function(){
	this.innerHTML = this.originalHtml;
	for (var attr in this.originalAttributes) this.setAttribute (attr, this.originalAttributes[attr]);
	for (var item in dicoPlay) this.print (item, dicoPlay[item]);
}
function dpInit(){
	// nettoyer le texte
	document.body.innerHTML = document.body.innerHTML.cleanHtml();
	document.body.initAjax()
	for (var item in dicoPlay) document.body.print (item, dicoPlay[item]);
//	for (var item in dicoPlay) if ('Array String Number Object'.includes (dicoPlay[item].constructor.name)) document.body.print (item, dicoPlay[item]);
}
