// dépend de textFct.js
// niveaux de logs
var logState = 'debug';
const logStates =[ 'debug', 'info', 'warn', 'error'];
// mise en forme des lignes
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var debugNb =0;
const debugStyleLog = 'color: purple; font-family: calibri; font-size: 1em;';
const debugStyleMessage = 'color: purple; font-family: calibri; font-size: 1.4em;';

function getStackChrome (stackText){
	const stack ={ func: 'view', line: '0', file: "rien" };
	var p= stackText.lastIndexOf (':');
	stackText = stackText.substring (3,p);
	p= stackText.indexOf (' (');
	const stackList = stackText.split (':');
	if (stackList[0]) stack.func = stackList[0];
	stack.line = stackList[2];
	stack.file = stackList[1];
	if (stack.file.includes ('\\')) p= stack.file.lastIndexOf ('\\');
	else p= stack.file.lastIndexOf ('/');
	p+=1;
	stack.file = stack.file.substring (p);
	return stack;
}
function getStackGeneral (stackText){
	const stack ={ func: 'view', line: '0', file: "rien" };
	var p= stackText.lastIndexOf (':');
	stackText = stackText.substring (3,p);
	p= stackText.indexOf (' (');
	const stackList = stackText.split (':');
	if (stackList[0]) stack.func = stackList[0];
	stack.line = stackList[2];
	stack.file = stackList[1];
	if (stack.file.includes ('\\')) p= stack.file.lastIndexOf ('\\');
	else p= stack.file.lastIndexOf ('/');
	p+=1;
	stack.file = stack.file.substring (p);
	return stack;
}
function getStack(){
	var stackText = new Error().stack;
	stackText = stackText.replaceAll ('file:///',"");
	stackText = stackText.replaceAll ('C:/',"");
	stackText = stackText.replaceAll ('@',':');
	stackText = stackText.replaceAll (' (chrome-extension://',':');
	var stackList = stackText.split ('\n');
	var trash = stackList.shift();
	while (stackList[0].includes ('logger.js')) trash = stackList.shift();
	stackText = stackList[0].trim();
	var stack ={};
	if (navigator.userAgent.includes ('Chrome/')) stack = getStackChrome (stackText);
	else stack = getStackGeneral (stackText);
	return stack;
}
function toMessage (object){
	if (object === null) return 'nul';
	else if (object === undefined) return 'indéfini';
	else if (object === true) return 'oui';
	else if (object === false) return 'non';
	else if (typeof (object) === 'function') return "";
	else{
		var message = object.toMessage();
		if (message === undefined) return object.toString();
		else return message;
}}
function log(){
	const stack = getStack();
	var message ="";
	for (var a=0; a< arguments.length; a++) message = message +'\n'+ toMessage (arguments[a]);
	message = message.trim();
	console.log ('%c'+ stack.file +' '+ stack.line +': %c '+ message, debugStyleLog, debugStyleMessage);
}
function logCondition (condition){ if (condition) log(); }
function logLetter(){
	if (debugNb >25) debugNb =0;
	log ([ alphabet [debugNb], ]);
	debugNb ++;
}
Object.prototype.toMessage = function(){
	var message = 'dictionnaire';
	var messageTmp ="";
	for (var d in this){
		messageTmp = toMessage (this[d]);
		if (messageTmp !=="") message = message +'\n'+d+': '+ toMessage (this[d]);
	}
	return message;
}
String.prototype.toMessage = function(){ return this; }
Number.prototype.toMessage = function(){ return this.toString(); }
Element.prototype.toMessageTag = function(){
	var message = this.tagName;
	if (this.id) message = message +' #'+ this.id;
	if (this.className) message = message +' .'+ this.className;
	if (this.getAttribute ('role')) message = message +' :'+ this.getAttribute ('role');
	return message;
}
Element.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\n'+ this.children.length.toString() +' enfants';
	return message;
}
HTMLImageElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\nsrc: '+ this.src +'\nalt: '+ this.alt;
	return message;
}
HTMLAnchorElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\nhref: '+ this.href;
	return message;
}
HTMLFormElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\nmethod: '+ this.method +'\taction: '+ this.action;
	return message;
}
HTMLInputElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\ntype: '+ this.type +'\tname: '+ this.name +'\nvalue: '+ this.value;
	return message;
}
HTMLSelectElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\nname: '+ this.name;
	message = message +'\n'+ this.children.length.toString() +' options';
	for (var a=0; a< this.attributes.length; a++) if ('on' === this.attributes[a].name.substring (0,2)){
		message = message + '\n'+ this.attributes[a].name +': '+ this.attributes[a].value;
	}
	return message;
}
HTMLOptionElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	message = message +'\nname: '+ this.parentElement.name +'\nvalue: '+ this.value;
	return message;
}
HTMLButtonElement.prototype.toMessage = function(){
	var message = this.toMessageTag();
	for (var a=0; a< this.attributes.length; a++) if ('on' === this.attributes[a].name.substring (0,2)){
		message = message + '\n'+ this.attributes[a].name +': '+ this.attributes[a].value;
	}
	return message;
}
Array.prototype.toMessage = function(){
	var message = 'liste de '+ this.length.toString() +' éléments\n';
	var end = this.length;
	if (end >5) end =5;
	for (var i=0; i< end; i++) message = '\n'+ message + toMessage (this[i]) +'\n';
	return message;
}
HTMLCollection.prototype.toMessage = function(){
	var message = 'liste de '+ this.length.toString() +' éléments html';
	var end = this.length;
	if (end >5) end =5;
	for (var i=0; i< end; i++) message = '\n'+ message + this[i].toMessage();
	return message;
}
// niveaux de logs
function logError(){ log (arguments); }
function logWarn(){ if (logStates.splice (0, 3).includes (logState)) log (arguments); }
function logInfo(){ if (logStates.splice (0, 2).includes (logState)) log (arguments); }
function logDebug(){ if (logStates[0] == logState) log (arguments); }
