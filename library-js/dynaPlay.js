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
var dpVarList =[];
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
/* ======================== fonctions d'affichage ======================== */

String.prototype.printOne = function (varName, varValue){
	var text = null;
	if (varValue.constructor.name == 'Array'){
		// récupérer le tag de premier niveau
		var d= this.index ('(('+ varName +'))');
		var f=d;
		var deep = varValue.deep();
		while (deep >0){
			f= this.index ('>',f) +1;
			d= this.rindex ('<',d-1);
			deep = deep -1;
		}
		var template = this.slice (d,f);
		var message = null;
		text = this.slice (0,d) + this.slice (f);
		// gérer la profondeur
		for (var l= varValue.length -1; l>=0; l--){
			message = template.printOne (varName, varValue[l]);
			text = text.insert (message, d);
	}}
	else if (varValue.constructor.name == 'Object'){
		var d= this.index ('(('+ varName +'))');
		var f= this.index ('>',d) +1;
		d= this.rindex ('<',d);
		var template = this.slice (d,f);
		var text = this.slice (0,d) + this.slice (f);
		for (var l in varValue) if (typeof (varValue[l]) != 'function'){
			text = text.insert (template, d);
			text = text.printOne (varName, varValue[l]);
	}}
	else text = this.replace ('(('+ varName +'))', varValue);
	return text;
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
		if (varValue.constructor.name != 'Array' && this[varName].constructor.name == 'Array') this[varName].push (varValue);
		else this[varName] = varValue;
	}
	else{
		var listName = varName.split ('.');
		if (listName.length ==2) this[listName[0]][listName[1]] = varValue;
		else if (listName.length ==3) this[listName[0]][listName[1]][listName[2]] = varValue;
		else if (listName.length ==4) this[listName[0]][listName[1]][listName[2]][listName[3]] = varValue;
		else if (listName.length ==5) this[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]] = varValue;
		else if (listName.length ==6) this[listName[0]][listName[1]][listName[2]][listName[3]][listName[4]][listName[5]] = varValue;
}}
HTMLInputElement.prototype.reload = function(){
	if (this.type === 'checkbox' && this.checked === false){
		var varValue = getValueFromName (this.name);
		varValue.popItem (this.value);
		setValueFromName (this.name, varValue);
	}
	else setValueFromName (this.name, this.value);
	document.body.innerHTML = bodyTemplate;
	printAll();
}
HTMLTextAreaElement.prototype.reload = function(){
	setValueFromName (this.name, this.value);
	document.body.innerHTML = bodyTemplate;
	printAll();
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
				console.log (event.target);
				setValueFromName (event.target.parentElement.getAttribute ('name'), event.target.innerHTML);
				document.body.innerHTML = bodyTemplate;
				printAll();
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
function printAll(){
	for (var v=0; v< dpVarList.length; v++){
		var varValue = getValueFromName (dpVarList[v]);
		document.body.innerHTML = document.body.innerHTML.printOne (dpVarList[v], varValue);
	}
	printInput ('input');
	printInput ('textarea');
	printSelector();
	document.body.printCondition();
}
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
	for (var v=1; v< bodyList.length; v=v+2) dpVarList.push (bodyList[v]);
	printAll();
}