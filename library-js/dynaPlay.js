/*
dépendence:		text.js
utilisation:	dpInit();

	la condition
<p if='condiTrue'>coucou</p>
<p if='1===2'>doudou</p>
	le sélecteur
<selector name='choix'>
	<h3>choisir: (( choix ))</h3>
	<p>(( selectList ))</p>
</selector>
*/
var dpVarList ={};
var bodyTemplate ="";

/* ======================== fonctions utilitaires ======================== */

Array.prototype.contain = function (item){
	var pos = this.indexOf (item);
	if (pos >=0) return true;
	else return false;
}
Array.prototype.pop = function (pos){
	if (pos <0) pos += this.length;
	var trash = this.splice (pos, 1);
}
Array.prototype.popItem = function (item){
	if (this.contain (item)){
		var pos = this.indexOf (item);
		this.pop (pos);
}}
Array.prototype.deep = function(){
	if (this.length >0 && this[0].constructor.name == 'Array'){
		var degre =1;
		degre = degre + this[0].deep();
		return degre;
	}
	else return 1;
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
HTMLElement.prototype.getByContent = function (word){
	if (this.innerHTML.contain (word)){
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
/* ======================== fonctions d'affichage ======================== */

HTMLElement.prototype.printOne = function (varName, varValue){
	if (! exists (varValue)) this.innerHTML = this.innerHTML.replace ('(('+ varName +'))', " ");
	else if (varValue.constructor.name == 'Array'){
		var nodeRef = null;
		var nodeNew = null;
		var deep = varValue.deep();
		var deepTmp = deep;
		while (this.innerHTML.contain ('((' + varName + '))')){
			deepTmp = deep;
			nodeRef = this.getByContent ('((' + varName + '))');
			while (deepTmp >1){
				nodeRef = nodeRef.parentElement;
				deepTmp = deepTmp -1;
			}
			var i=0;
			for (; i< varValue.length -1; i++){
				nodeNew = nodeRef.copy (true);
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
	else this.innerHTML = this.innerHTML.replace ('(('+ varName +'))', varValue);
}
function getValueFromName (varName){
	var varValue = null;
	if (! varName.contain ('.')) varValue = this[varName];
	else{
		var listName = varName.split ('.');
		varValue = this[listName[0]][listName[1]];
		for (var w=2; w< listName.length; w++) varValue = varValue[listName[w]];
	}
	if (varValue == undefined) varValue = null;
	return varValue;
}
function setValueFromName (varName, varValue){
	if (varValue == undefined) varValue = null;
	if (! varName.contain ('.')){
		if (varValue.constructor.name != 'Array' && dpVarList[varName].constructor.name == 'Array') dpVarList[varName].push (varValue);
		else dpVarList[varName] = varValue;
	}
	else{
		var listName = varName.split ('.');
		if (listName.length ==2) dpVarList[listName[0]][listName[1]] = varValue;
		else if (listName.length ==3) dpVarList[listName[0]][listName[1]][listName[2]] = varValue;
		else if (listName.length ==4) dpVarList[listName[0]][listName[1]][listName[2]][listName[3]] = varValue;
		else if (listName.length ==5) dpVarList[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]] = varValue;
		else if (listName.length ==6) dpVarList[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]][listName[5]] = varValue;
}}
HTMLInputElement.prototype.reload = function(){
	if (this.type === 'checkbox' && this.checked === false){
		var varValue = getValueFromName (this.name);
		varValue.popItem (this.value);
		setValueFromName (this.name, varValue);
	}
	else setValueFromName (this.name, this.value);
	document.body.innerHTML = bodyTemplate;
	document.body.printAll (dpVarList);
}
HTMLTextAreaElement.prototype.reload = function(){
	setValueFromName (this.name, this.value);
	document.body.innerHTML = bodyTemplate;
	document.body.printAll (dpVarList);
}
function printInput (type){
	var inputList = document.getElementsByTagName (type);
	for (var i=0; i< inputList.length; i++){
		var varValue = getValueFromName (inputList[i].name);
		if (varValue){
			if (inputList[i].tagName === 'TEXTAREA' || ! 'radio checkbox'.contain (inputList[i].getAttribute ('type')))
				inputList[i].value = varValue;
			else if (inputList[i].value === varValue && inputList[i].type === 'radio') inputList[i].checked = true;
			else if (varValue.contain (inputList[i].value) && inputList[i].type === 'checkbox') inputList[i].checked = true;
			inputList[i].addEventListener ('change', function (event){ event.target.reload(); });
}}}
function printSelector(){
	var selectList = document.getElementsByTagName ('selector');
	for (var i=0; i< selectList.length; i++){
		for (var o=1; o< selectList[i].children.length; o++){
			selectList[i].children[o].addEventListener ('click', function (event){
				setValueFromName (event.target.parentElement.getAttribute ('name'), event.target.innerHTML);
				document.body.innerHTML = bodyTemplate;
				document.body.printAll (dpVarList);
			});
}}}
HTMLElement.prototype.printCondition = function(){
	if (this.getAttribute ('if')){
		var printBlock = eval (this.getAttribute ('if'));
		if (printBlock) for (var c=0; c< this.children.length; c++) this.children[c].printCondition();
		else this.style.display = 'none';
	}
	else for (var c=0; c< this.children.length; c++) this.children[c].printCondition();
}
HTMLElement.prototype.printAll = function (varList){
	if (! exists (varList)) varList = dpVarList;
	this.printFor();
	for (var v in varList) this.printOne (v, varList[v]);
	printInput ('input');
	printInput ('textarea');
	printSelector();
	this.printCondition();
}
HTMLElement.prototype.printFor = function(){
	if (this.innerHTML.contain ('for=')) for (var c=0; c< this.children.length; c++) this.children[c].printFor();
	if (this.getAttribute ('for')){
		var varName = this.getAttribute ('for');
		var varValue = getValueFromName (varName);
		this.removeAttribute ('for');
		var nodeNew = null;
		if (varValue.constructor.name == 'Array'){
			for (var i= varValue.length -1; i>0; i--){
				nodeNew = this.copy (true);
				nodeNew.printAll (varValue[i]);
			}
			this.printAll (varValue[0]);
		}
		else if (varValue.constructor.name == 'Object') this.printAll (varValue);
}}
function dpInit(){
	// nettoyer le texte
	document.body.innerHTML = document.body.innerHTML.replace ('\n');
	document.body.innerHTML = document.body.innerHTML.replace ('\t');
	document.body.innerHTML = document.body.innerHTML.clean();
	document.body.innerHTML = document.body.innerHTML.replace ('(( ', '((');
	document.body.innerHTML = document.body.innerHTML.replace (' ))', '))');
	bodyTemplate = document.body.innerHTML;
	// récupérer les variables
	var bodyText = document.body.innerHTML.replace ('))', '((');
	var bodyList = bodyText.split ('((');
	var varValue = null;
	for (var v=1; v< bodyList.length; v=v+2){
		varValue = getValueFromName (bodyList[v]);
		if (exists (varValue)) dpVarList [bodyList[v]] = varValue;
	}
	document.body.printAll (dpVarList);
}