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
function useDate(){
	// constantes pour afficher un popup de calendrier
	debbyPlay.yearList =[ '2018', '2019', '2020' ];
	debbyPlay.monthList =[ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre' ];
	debbyPlay.dayList =[ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ];
}
function init(){
	document.body.useTemplates();
	document.body.clean();
	bodyRef = document.body.innerHTML;
	for (var v in debbyPlay) document.body.printVar (v, debbyPlay[v]);
	initInput();
	printLink();
	document.body.createCalendar();
	document.body.createSelection();
	document.body.createCarousel();
	conditionnal();
}
function load(){
	document.body.innerHTML = bodyRef;
	for (var v in debbyPlay) document.body.printVar (v, debbyPlay[v]);
	initInput();
	printLink();
	document.body.createCalendar();
	document.body.createSelection();
	document.body.createCarousel();
	conditionnal();
}
HTMLElement.prototype.finish = function (fieldList){
	// fieldList =[ '((a))', '((b))' ]
	if (this.tagName == 'SCRIPT') return;
	if (fieldList && this.innerHTML.contain ('((')) for (var f=0; f< fieldList.length; f++)
		this.innerHTML = this.innerHTML.replace (fieldList[f]);
	else if (this.outerHTML.contain ('((')){
		for (var c=0; c< this.children.length; c++) this.children[c].finish();
		if (this.innerHTML.contain ('((')) this.innerHTML ="";
	}
}
// affichage conditionnel de certaines balises
function conditionnal(){
	var tagList = document.getElementsByTagName ('*');
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
		title.innerText = debbyPlay [titleName];
}}
HTMLElement.prototype.createCarousel = function(){
	var selectList = this.getElementsByTagName ('carousel');
	var title, varName, titleName, before, after;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].innerText[0].toLowerCase() + selectList[s].innerText.slice (1);
		selectList[s].innerHTML ="";
		selectList[s].setAttribute ('for', varName);
		titleName = selectList[s].getAttribute ('name');
		before = createNode ('p', '<', selectList[s]);
		title = createInput ('text', debbyPlay[titleName], selectList[s]);
		after = createNode ('p', '>', selectList[s]);
		title.addEventListener ('mouseleave', setCurrent);
		before.addEventListener ('click', setBefore);
		after.addEventListener ('click', setAfter);
}}
// fonction pour afficher un calendrier
HTMLElement.prototype.createCalendar = function(){
	// le callback a pour arguments: int year, string month, int monthId, int day
	const month31 = 'janvier mars mai juillet aout octobre decembre';
	const month30 = 'avril juin septembre novembre';
	var calList = this.getElementsByTagName ('calendar');
	for (var s=0; s< calList.length; s++){
		var years = createNode ('carousel', "", calList[s]);
		years.innerHTML = 'yearList';
	//	years.setAttribute ('for', 'yearList');
		var months = createNode ('selection', "", calList[s]);
		months.innerHTML = 'monthList';
	//	months.setAttribute ('for', 'monthList');
		var days = createNode ('selection', "", calList[s]);
		days.innerHTML = 'dayList';
	//	days.setAttribute ('for', 'dayList');
		calList[s].addEventListener ('click', function (event){
			var month = event.target.parentElement.parentElement.getElementsByTagName ('p')[2].innerText.toLowerCase();
			var monthNb =28;
			debbyPlay.dayList =[];
			if (month31.indexOf (month) >=0) monthNb =31;
			else if (month30.indexOf (month) >=0) monthNb =30;
			else{
				var year = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('input')[0].value);
				if (year %400 ==0 || (year %100 >0 && year %4==0)) monthNb =29;
			}
			var dayList = event.target.parentElement.parentElement.lastChild;
			var currentNb = parseInt (dayList.lastChild.innerText);
			if (currentNb < monthNb){
				currentNb = currentNb +1;
				for (var currentNb; currentNb <= monthNb; currentNb ++)
					var option = createNode ('option', currentNb, dayList, null, null, currentNb);
			}
			else if (currentNb > monthNb){
				var strNb = monthNb.toString();
				while (dayList.lastChild.innerText > strNb) dayList.removeChild (dayList.lastChild);
		}});
		if (calList[s].getAttribute ('callback')) calList[s].addEventListener ('click', function (event){
			var year = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('input')[0].value);
			var month = event.target.parentElement.parentElement.getElementsByTagName ('p')[2].innerText.toLowerCase();
			var monthId =1+ parseInt (event.target.parentElement.parentElement.getElementsByTagName ('p')[2].id);
			var day = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('p')[3].innerText);
			var callback = event.target.parentElement.parentElement.getAttribute ('callback');
			window[callback] (year, month, monthId, day);
});}}
useTemplate = function (idInsert, idTemplate){
	var insert = document.querySelector ('insert#' + idInsert);
	if (idTemplate.contain ('.html')){
		var responseText = fromFileSync (idTemplate);
		if (responseText){
			insert.innerHTML = responseText;
			insert = insert.children[0];			
	}}
	else{
		var template = document.querySelector ('template#' + idTemplate);
		insert.innerHTML = template.innerHTML;
}}
// ________________________ fonctions appelées dans les précédentes ________________________

// fonctions gérant mes sélecteurs
updateSelection = function (event){
	var title = event.target.parentElement.getElementsByTagName ('p')[0];
	var varName = event.target.parentElement.getAttribute ('name');
	debbyPlay[varName] = event.target.innerText;
	title.innerText = event.target.innerText;
	load();
}
setCurrent = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	if (pos <0) pos =0;
	var titleName = event.target.parentElement.getAttribute ('name');
	debbyPlay[titleName] = list[pos];
	load();
}
setBefore = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	pos -=1;
	if (pos <0) pos = list.length -1;
	var titleName = event.target.parentElement.getAttribute ('name');
	debbyPlay[titleName] = list[pos];
	load();
}
setAfter = function (event){
	var list = debbyPlay [event.target.parentElement.getAttribute ('for')];
	var pos = list.indexOf (event.target.parentElement.getElementsByTagName ('input')[0].value);
	pos +=1;
	if (pos >= list.length) pos =0;
	var titleName = event.target.parentElement.getAttribute ('name');
	debbyPlay[titleName] = list[pos];
	load();
}
// rendre les inputs interractifs
function initInput(){
	var inputList = document.getElementsByTagName ('input');
	for (var i=0; i< inputList.length; i++){
		inputList[i].setAttribute ('value', debbyPlay [inputList[i].getAttribute ('name')]);
		inputList[i].addEventListener ('mouseleave', modifInput);
	}
	inputList = document.getElementsByTagName ('textarea');
	for (var i=0; i< inputList.length; i++){
		inputList[i].setAttribute ('value', debbyPlay [inputList[i].getAttribute ('name')]);
		inputList[i].addEventListener ('mouseleave', modifInput);
	}
}
function modifInput (event){
	var varName = event.target.getAttribute ('name');
	debbyPlay[varName] = event.target.value;
	load();
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
printLink = function(){
	var linkList = document.getElementsByTagName ('a');
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
HTMLElement.prototype.useTemplates = function(){
	// utiliser un template html
	var insertList = document.getElementsByTagName ('insert');
	for (var i=0; i< insertList.length; i++){
		if (insertList[i].id.contain ('.html')){
			var responseText = fromFileSync (insertList[i].id);
			if (responseText){
				insertList[i].innerHTML = responseText;
				insertList[i] = insertList[i].children[0];
		}}
		else{
			var template = document.querySelector ('template#' + insertList[i].id);
			insertList[i].innerHTML = template.innerHTML;
}}}
HTMLElement.prototype.useTemplates_va = function(){
	// utiliser un template html
	var templateList = this.getElementsByTagName ('template');
	for (var t=0; t< templateList.length; t++){
		var insertList = document.querySelectorAll ('insert#' + templateList[t].id);
		if (templateList[t].id.contain ('.html')){
			var responseText = fromFileSync (templateList[t].id);
			if (responseText) for (var i=0; i< insertList.length; i++){
				insertList[i].innerHTML = responseText;
				insertList[i] = insertList[i].children[0];
		}}
		else for (var i=0; i< insertList.length; i++) insertList[i].innerHTML = templateList[t].innerHTML;
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
				load();
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
