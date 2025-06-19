// fonctionne avec textFct.js

Element.prototype.countRole = function (myRole){
	var itemNb =0;
	const role = this.getAttribute ('role');
	if (myRole === role) itemNb =1;
	for (var c=0; c< this.children.length; c++) itemNb += this.children[c].countRole (myRole);
	return itemNb;
}
Element.prototype.getXpathRole = function(){
	const role = this.getAttribute ('role');
	if (! exists (this.role)) return "";
	var itemNb = document.body.countRole (this.role);
	if (1=== itemNb) return " *"+ this.role;
	else{
		itemNb = this.parentElement.countRole (this.role);
		if (1=== itemNb) return this.role;
		else return "";
}}
Element.prototype.getXpathTag = function(){
	var itemNb = document.getElementsByTagName (this.tagName).length;
	if (1=== itemNb) return " !"+ this.tagName;
	else{
		itemNb = this.parentElement.getElementsByTagName (this.tagName).length;
		if (1=== itemNb) return this.tagName;
		else return "";
}}
Element.prototype.getXpathClass = function(){
	if (this.classList.length ===0) return "";
	var classUnique ="";
	var c=0;
	var itemNb =0;
	while (""=== classUnique && c< this.classList.length){
		itemNb = document.getElementsByClassName (this.classList[c]).length;
		if (1=== itemNb) classUnique = " ."+ this.classList[c];
		c+=1;
	}
	c=0;
	while (""=== classUnique && c< this.classList.length){
		itemNb = this.parentElement.getElementsByClassName (this.classList[c]).length;
		if (1=== itemNb) classUnique = this.classList[c];
		c+=1;
	}
	if (""!== classUnique) return classUnique;
	else return "";
}
Element.prototype.childUnique = function (childNode, childClass, childRole){
	const itemList0 = this.getElementsByTagName (childNode.tagName);
	var itemList =[];
	// vérifier qu'il n'y a qu'un seul élément possédant la combinaison tag - class - role
	if (childRole && childClass){
		for (var i=0; i< itemList0.length; i++)
			if (childRole === itemList0[i].getAttribute ('role') && itemList0[i].className.includes (childClass)){
				itemList.push (itemList0[i]);
	}}
	else if (childRole){
		for (var i=0; i< itemList0.length; i++) if (childRole === itemList0[i].getAttribute ('role')){
			itemList.push (itemList0[i]);
	}}
	else if (childClass){
		for (var i=0; i< itemList0.length; i++) if (itemList0[i].className.includes (childClass)){
			itemList.push (itemList0[i]);
	}}
	var finalXpath ="";
	if (1=== itemList.length){
		if (childNode.tagName) finalXpath = finalXpath +'!'+ childNode.tagName;
		if (childClass) finalXpath = finalXpath +'.'+ childClass;
		if (exists (childRole)) finalXpath = finalXpath +'*'+ childRole;
	}
	else{
		var posChild =0;
		while (posChild < itemList0.length && ! childNode.isEqualNode (itemList0 [posChild])) posChild +=1;
		finalXpath = finalXpath +'!'+ childNode.tagName +':'+ posChild.toString();
	}
	return " "+ finalXpath;
}
Element.prototype.getXpath = function(){
	if (! this.id.isEmpty()) return " #"+ this.id;
	const pathTag = this.getXpathTag();
	if (pathTag && " "=== pathTag[0]) return pathTag;
	const pathClass = this.getXpathClass();
	if (pathClass && " "=== pathClass[0]) return pathClass;
	const pathRole = this.getXpathRole();
	if (pathRole && " "=== pathRole[0]) return pathRole;
	var finalXpath = document.body.childUnique (this, pathClass, pathRole);
	if (finalXpath.includes (':') && 'BODY' !== this.parentElement.tagName){
		finalXpath = this.parentElement.childUnique (this, pathClass, pathRole);
		finalXpath = this.parentElement.getXpath() + finalXpath;
	}
	return finalXpath;
}
function tagFromXpath (xpath){
	xpath = xpath.substring (1);
	const tagList = xpath.split (" ");
	var item = document.body;
	var t=0;
	if ('#' === tagList[t][0]){
		item = document.getElementById (tagList[0].substring (1));
		t=1;
	}
	for (; t< tagList.length; t++){
		tagList[t] = tagList[t].substring (1);
		if ('.'=== tagList[t][0]) item = item.getElementsByClassName (tagList[t][0].substring (1))[0];
		else if ('!'=== tagList[t][0]){
			tagList[t] = tagList[t].substring (1)[0];
			var posChild =0;
			if (tagList[t].includes (':')){
				const index = tagList[t].indexOf (':');
				posChild = int (tagList[t].substring (index +1));
			}
			item = item.getElementsByTagName (tagList[t]) [posChild];
	}}
	return item;
}
function tagFromXpath_va (xpath){
	xpath = xpath.substring (1);
	xpath = xpath.replaceAll ('#', '?#');
	xpath = xpath.replaceAll ('.', '?.');
	xpath = xpath.replaceAll ('*', '?*');	// le role
	xpath = xpath.replaceAll ('!', '?!');	// le tagName
	xpath = xpath.replaceAll (':', '?:');	// le numéro du tag
	xpath = xpath.replaceAll (" ", '?/');	// un nouveau tag
	if ('?'=== xpath[0]) xpath = xpath.substring (1);
	const xpathList = xpath.split ('!');
	var item = document.body;
	if ('#'=== xpathList[0]) item = document.getElementById (xpathList[0].substring (1));
	else if (" "=== xpathList[0]) item = document.getElementsByTagName (xpathList[0].substring (1))[0];
	else if ('.'=== xpathList[0]) item = document.getElementsByClassName (xpathList[0].substring (1))[0];
	for (var i=1; i< xpathList.length; i++){
		if (" "=== xpathList[i]) item = item.getElementsByTagName (xpathList[i].substring (1))[0];
		else if ('.'=== xpathList[i]) item = item.getElementsByClassName (xpathList[i].substring (1))[0];
	}
	return item;
}