/* framework pour utiliser des templates html.
je me suis inspirée de la foncionnalité de base d'angularjs.
display-test démontre son utilisation.

dépendences:
	display.css
	text.js

________________________ fonctions utilisable par vous ________________________ */

// affichage de base
var bodyRef =""
var debbyPlay ={};
// constantes pour afficher un popup de calendrier
const month31 = 'janvier mars mai juillet aout octobre decembre';
const month30 = 'avril juin septembre novembre';
function useDate(){
	debbyPlay.yearList =[ '2018', '2019', '2020', '2021', '2022' ];
	debbyPlay.monthList =[ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre' ];
	debbyPlay.dayList =[ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ];
}
HTMLElement.prototype.init = function(){
	this.clean();
	if (this.tagName == 'BODY') bodyRef = this.innerHTML;
	this.printAll();
}
HTMLElement.prototype.load = function(){
	if (this.tagName == 'BODY') this.innerHTML = bodyRef;
	this.printAll();
}
HTMLElement.prototype.printAll = function(){
	for (var v in debbyPlay) this.printVar (v, debbyPlay[v]);
	this.initInput();
	this.printLink();
	this.createCalendar();
	this.createSelection();
	this.createCarousel();
	this.conditionnal();
}
// affichage conditionnel de certaines balises
HTMLElement.prototype.conditionnal = function(){
	var tagList = this.getElementsByTagName ('*');
	for (var t=0; t< tagList.length; t++) if (tagList[t].getAttribute ('if') &&! eval (tagList[t].getAttribute ('if')))
		tagList[t].className = 'hidden';
}
// afficher des sélecteurs
HTMLElement.prototype.createSelection = function(){
	var selectList = this.getElementsByTagName ('selection');
	var title, option, varName, titleName;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].innerText[0].toLowerCase() + selectList[s].innerText.slice (1);
		selectList[s].innerHTML ="";
		title = createNode ('p', "", selectList[s]);
		for (var v in debbyPlay[varName]){
			option = createNode ('option', debbyPlay[varName][v], selectList[s], null, null, v);
			option.addEventListener ('click', updateSelection);
		}
		titleName = selectList[s].getAttribute ('name');
		titleValue = titleName.selGetValue()
		title.innerText = titleValue;
}}
HTMLElement.prototype.createCarousel = function(){
	var selectList = this.getElementsByTagName ('carousel');
	var title, varName, titleName, before, after;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].innerText[0].toLowerCase() + selectList[s].innerText.slice (1);
		selectList[s].innerHTML ="";
		selectList[s].setAttribute ('for', varName);
		titleName = selectList[s].getAttribute ('name');
		titleValue = titleName.selGetValue()
		before = createNode ('p', '<', selectList[s]);
		title = createInput ('text', titleValue, selectList[s]);
		after = createNode ('p', '>', selectList[s]);
		title.addEventListener ('mouseleave', setCurrent);
		before.addEventListener ('click', setBefore);
		after.addEventListener ('click', setAfter);
}}
// fonction pour afficher un calendrier
HTMLElement.prototype.createCalendar = function(){
	// le callback a pour arguments: int year, string month, int monthId, int day
	var calList = this.getElementsByTagName ('calendar');
	for (var s=0; s< calList.length; s++){
		var titleName = calList[s].getAttribute ('name');
		var years = createNode ('carousel', "yearList", calList[s]);
		years.setAttribute ('name', titleName + '.year');
		var months = createNode ('selection', "monthList", calList[s]);
		months.setAttribute ('name', titleName + '.month');
		months.addEventListener ('click', function (event){
			var monthId =1+ debbyPlay.monthList.indexOf (event.target.parentElement.getElementsByTagName ('p')[0].innerText.toLowerCase());
			debbyPlay[titleName]['monthId'] = toString (monthId);
			// gérer la durée du mois
			var monthNb =28;
			if (month31.indexOf (debbyPlay[titleName].month) >=0) monthNb =31;
			else if (month30.indexOf ((debbyPlay[titleName].month)) >=0) monthNb =30;
			else{
				var year = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('input')[0].value);
				if (year %400 ==0 || (year %100 >0 && year %4==0)) monthNb =29;
			}
			debbyPlay.dayList =[];
			for (var d=1; d<= monthNb; d++) debbyPlay.dayList.push (toString (d));
			document.body.load();
		});
		var days = createNode ('selection', "dayList", calList[s]);
		days.setAttribute ('name', titleName + '.day');
}}
HTMLElement.prototype.useTemplate = function (template){
	/* template peut être
		- du code html
		- l'url d'un fichier html
	*/
	if (template.contain ('.html')){
		var responseText = fromFileSync (template);
		if (responseText) this.innerHTML = responseText;
	}
	else this.innerHTML = template;
	this.init();
}
// ________________________ fonctions appelées dans les précédentes ________________________

// fonctions gérant mes sélecteurs
String.prototype.selGetValue = function(){
	var value = debbyPlay[this];
	if (this.contain ('.')){
		value = debbyPlay;
		var list = this.split ('.');
		for (var v=0; v< list.length; v++) value = value[list[v]];
	}
	return value;
}
String.prototype.selSetValue = function (value){
	debbyPlay[this] = value;
	if (this.contain ('.')){
		var list = this.split ('.');
		if (list.length ==2) debbyPlay[list[0]][list[1]] = value;
		else if (list.length ==3) debbyPlay[list[0]][list[1]][list[2]] = value;
}}
function toString (nb){
	var nbStr = nb.toString();
	if (nbStr.length ==1) nbStr = '0'+ nbStr;
	return nbStr;
}
updateSelection = function (event){
	var title = event.target.parentElement.getElementsByTagName ('p')[0];
	var varName = event.target.parentElement.getAttribute ('name');
	varName.selSetValue (event.target.innerText);
//	debbyPlay[varName] = event.target.innerText;
	title.innerText = event.target.innerText;
	document.body.load();
}
setCurrent = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	if (pos <0) pos =0;
	var titleName = event.target.parentElement.getAttribute ('name');
	titleName.selSetValue (list[pos]);
	document.body.load();
}
setBefore = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	pos -=1;
	if (pos <0) pos = list.length -1;
	var titleName = event.target.parentElement.getAttribute ('name');
	titleName.selSetValue (list[pos]);
//	debbyPlay[titleName] = list[pos];
	document.body.load();
}
setAfter = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	pos +=1;
	if (pos >= list.length) pos =0;
	var titleName = event.target.parentElement.getAttribute ('name');
	titleName.selSetValue (list[pos]);
	document.body.load();
}
// rendre les inputs interractifs
HTMLElement.prototype.initInput = function(){
	var inputList = this.getElementsByTagName ('input');
	for (var i=0; i< inputList.length; i++){
		inputList[i].setAttribute ('value', debbyPlay [inputList[i].getAttribute ('name')]);
		inputList[i].addEventListener ('mouseleave', modifInput);
	}
	inputList = this.getElementsByTagName ('textarea');
	for (var i=0; i< inputList.length; i++){
		inputList[i].setAttribute ('value', debbyPlay [inputList[i].getAttribute ('name')]);
		inputList[i].addEventListener ('mouseleave', modifInput);
	}
}
function modifInput (event){
	var varName = event.target.getAttribute ('name');
	debbyPlay[varName] = event.target.value;
	document.body.load();
}
// affichage de base
HTMLElement.prototype.clean = function(){
	this.innerHTML = this.innerHTML.clean();
	this.innerHTML = this.innerHTML.replace ('(( ', '((');
	this.innerHTML = this.innerHTML.replace (' ))', '))');
}
HTMLElement.prototype.printVar = function (varName, value){
	if (! value) value ="";
	var varType = value.constructor.name;
	// les variables simple
	if (varType == 'String' || varType == 'Number'){
		var keyTag = '(('+ varName +'))';
	//	if (! this.innerHTML.contain (keyTag)) keyTag = '(())';
		this.innerHTML = this.innerHTML.replace (keyTag, value);
		/*
		for (var a=0; a< this.attributes.length; a++)
			if (typeof (this.attributes[a].value) == 'string' && this.attributes[a].value.contain (keyTag))
				this.setAttribute (this.attributes[a].name, this.attributes[a].value.replace (keyTag, value));
		*/
	}
	else if (varType == 'Array') this.printList (varName, value);
	else if (varType == 'Object') for (var v in value) this.printVar (varName +'.'+v, value[v]);
}
HTMLElement.prototype.printLink = function(){
	var linkList = this.getElementsByTagName ('a');
	var link = null, d;
	for (var l=0; l< linkList.length; l++){
		link = linkList[l].getAttribute ('href');
		if (link.slice (link.length -1) =='/') link = link.slice (0, link.length -1);
		var d= link.rindex ('/');
		link = link.slice (d+1);
		if (link.contain ('.')){
			d= link.rindex ('.');
			link = link.slice (0,d);
		}
		if (link.contain ('.')){
			d= link.rindex ('.');
			if (d == link.length -1){
				link = link.slice (0,d);
				d= link.rindex ('.');
			}
			d=d+1;
			link = link.slice (d);
		}
		if (link[0] =='#') link = link.slice (1);
		link = link.replace ('-', " ");
		link = link.replace ('_', " ");
		linkList[l].innerHTML = linkList[l].innerHTML.replace ('(())', link);
}}
useTemplateAssync = function (tagName, id){
	var tagDst = document.getElementsByTagName (tagName)[0];
	tagDst.style.display = 'block';
	var templateSrc =null;
	if (id.indexOf ('.html') >1){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4){
				tagDst.innerHTML = this.responseText;
				tagDst = tagDst.children[0];
				tagDst.init();

		}};
		xhttp.open ('GET', id, true);
		xhttp.send();
	}
	else{
		templateSrc = document.getElementById (id);
		tagDst.innerHTML = templateSrc.innerHTML;
}}
HTMLElement.prototype.printList = function (varName, value){
	// afficher une liste imbriquée
	if (value.constructor.name != 'Array' || value.length ==0) return;
	var nodeList = this.findContainerParenthesis (varName);
	if (! nodeList) nodeList =[];
	var nodeListTmp = this.findContainerFor (varName);
	if (nodeListTmp) for (var c=0; c< nodeListTmp.length; c++) nodeList.push (nodeListTmp[c]);
	if (! nodeList) return;
	// récupérer les conteneurs parents, pour les listes imbriquées
	var container;
	if (value[0].constructor.name == 'Object') for (var n=0; n< nodeList.length; n++){
		for (var v=0; v< value.length -1; v++){
			container = nodeList[n].copy (true);
			for (var w in value[v]){
				container.printVar (w, value[v][w]);
				container.printVar (varName +'.'+w, value[v][w]);
		}}
		for (var w in value[v]){
			nodeList[n].printVar (w, value[v][w]);
			nodeList[n].printVar (varName +'.'+w, value[v][w]);
	}} else{
		if (value[0].constructor.name == 'Array') for (var n=0; n< nodeList.length; n++) nodeList[n] = nodeList[n].findContainerList (value);
		for (var n=0; n< nodeList.length; n++){
			for (var v=0; v< value.length -1; v++){
				container = nodeList[n].copy (true);
				container.printVar (varName, value[v]);
			}
			nodeList[n].printVar (varName, value[v]);
}}}
HTMLElement.prototype.findContainerFor = function (varName){
	// retrouver le noeud contenant une liste d'objet, contenant un attribut for
//	if (this.tagName == 'selection' || this.tagName == 'carousel') return null;
	if (this.getAttribute ('for') && this.getAttribute ('for') == varName) return [ this ,];
	else if (
		! this.innerHTML.contain ("for='" + varName +"'") &&
		! this.innerHTML.contain ('for="' + varName +'"')) return null;
	var nodeList =[];
	var nodeListTmp =[];
	for (var c=0; c< this.children.length; c++){
		nodeListTmp = this.children[c].findContainerFor (varName);
		if (nodeListTmp) for (var l=0; l< nodeListTmp.length; l++) nodeList.push (nodeListTmp[l]);
	}
	if (nodeList.length ==0) nodeList =null;
	else if (nodeList[0].tagName == 'SELECTION' || nodeList[0].tagName == 'CAROUSEL') nodeList =null;
	return nodeList;
}
HTMLElement.prototype.findContainerModel = function (varName){
	var model = this.getAttribute ('model');
	if (! model || ! model.contain ('{{'+ varName +'}}')) return [];
	var nodeList =[];
	var nbOcurencies = model.count ('{{'+ varName +'}}');
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (this.children[c].getAttribute ('model') && this.children[c].getAttribute ('model').contain ('{{'+ varName +'}}')){
			nodeListTmp = this.children[c].findContainerModel (varName);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l=0; l< nodeListTmp.length; l++) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= this.children[c].getAttribute ('model').count ('{{'+ varName +'}}');
	}} c++; }
	if (nbOcurencies) nodeList.push (this);
	return nodeList;
}
HTMLElement.prototype.findContainerParenthesis = function (varName){
	// retrouver le noeud contenant directement la variable, avec les parenthèses
	if (! this.outerHTML.contain ('(('+ varName +'))') &&! this.outerHTML.contain ('(('+ varName +'.')) return null;
	var nbOcurencies = this.outerHTML.count ('(('+ varName +'))');
	nbOcurencies += this.outerHTML.count ('(('+ varName +'.');
	var nodeList =[];
	var nodeListTmp =[];
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (this.children[c].outerHTML.contain ('(('+ varName +'))') || this.children[c].outerHTML.contain ('(('+ varName +'.')){
			nodeListTmp = this.children[c].findContainerParenthesis (varName);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l=0; l< nodeListTmp.length; l++) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= this.children[c].outerHTML.count ('(('+ varName +'))');
				nbOcurencies -= this.children[c].outerHTML.count ('(('+ varName +'.');
	}} c++; }
	if (nbOcurencies) nodeList.push (this);
	return nodeList;
}
HTMLElement.prototype.findContainerList = function (value){
	/* vérifier si une liste est imbriquée
	node est le conteneur trouvé avec findContainerParenthesis
	*/
	if (value.constructor.name == 'Array' && value[0].constructor.name == 'Array'){
		node = this.parentElement;
		node = node.findContainerList (value[0]);
	}
	return node;
}
// fonctions modifiant un noeud
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
Object.prototype.fill = function (objRef){ for (var f in objRef) if (! this[f]) this[f] = objRef[f]; }
function useJson (jsonFile){
	var textRes = fromFileSync (jsonFile);
	return JSON.parse (textRes);
}
function fromFileSync (fileName){
	// mes fichiers sont petits, j'utilise les requêtes synchrones, simples à traiter
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', fileName, false);
	xhttp.send();
	var textRes = null;
	if (xhttp.status ==0 || xhttp.status ==200) textRes = xhttp.responseText;
	return textRes;
}
function fromFileAssync (fileName, callback){
	if (callback){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){ if (this.readyState ==4) callback (this.responseText); };
		xhttp.open ('GET', jsonFile, true);
		xhttp.send();
	}
	else console.log ('pas de callback, les données de', fileName, 'ne peuvent pas être utilisée');
}
