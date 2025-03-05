// dépend de textFct.js
// niveaux de logs
var logState = 'debug';
const logStates =[ 'debug', 'info', 'warn', 'error'];
// mise en forme des lignes
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var debugNb =0;
const debugStyleLog = 'color: #B09; font-size: 1em;';
const debugStyleMessage = 'color: #B09; font-size: 1.4em;';

function getStack(){
	var stackText = new Error().stack;
	stackText = stackText.replaceAll ('file:///',"");
	stackText = stackText.replaceAll ('C:/',"");
	stackText = stackText.replaceAll ('@',':');
	stack = stackText.split ('\n');
	var trash = stack.shift();
	while (stack[0].includes ('logger.js')) trash = stack.shift();
	trash = stack.pop();
	var tmpList =[];
	var stackFinal =[];
	for (var l=0; l< stack.length; l++){
		tmpList = stack[l].split (':');
		stackFinal.push ({
			func: tmpList[0],
			line: tmpList[2],
			file: tmpList[1]
		});
		if (! stackFinal [stackFinal.length -1].func) stackFinal [stackFinal.length -1].func = 'view';
	}
	return stackFinal[0];
}
function toMessage (object){
	if (object === null || object === undefined) return 'objet nul';
	else{
		var message = object.toMessage();
		if (message === undefined) return object.toString();
		else return message;
}}
function log(){
	const stack = getStack();
	var message ="";
	for (var a=0; a< arguments.length; a++) message = message +'\n'+ toMessage (arguments[a]);
	message = message.strip();
	console.log (' %c'+ stack.func +' '+ stack.line +': %c '+ message, debugStyleLog, debugStyleMessage);
}
function logCondition (condition){ if (condition) log(); }
function logLetter(){
	if (debugNb >25) debugNb =0;
	log ([ alphabet [debugNb], ]);
	debugNb ++;
}
Object.prototype.toMessage = function(){
	var message = 'dictionnaire';
	for (var d in this) message = message +'\n'+d+': '+ this[d];
	return message;
}
String.prototype.toMessage = function(){ return this; }
Number.prototype.toMessage = function(){ return this.toString(); }
Element.prototype.toMessageTag = function(){
	var message = this.tagName;
	if (this.id) message = message +' #'+ this.id;
	if (this.className) message = message +' .'+ this.className;
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
	var message = 'liste de '+ this.length.toString() +' éléments';
	var end = this.length;
	if (end >5) end =5;
	for (var i=0; i< end; i++) message = '\n'+ message + toMessage (this[i]);
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
