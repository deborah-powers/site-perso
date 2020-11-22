// dépend de text.js
// niveaux de logs
var logState = 'debug';
const logStates =[ 'debug', 'info', 'warn', 'error'];
// mise en forme des lignes

function getStack(){
	var stackText = new Error().stack;
	stackText = stackText.replace ('@file');
	stack = stackText.split ('\n');
	var trash = stack.shift();
	while (stack[0].contain ('logger.js')) trash = stack.shift();
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
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var debugNb =0;
const debugStyleLog = 'color: #B09; font-size: 1em;';
const debugStyleMessage = 'color: #B09; font-size: 1.4em;';

function logStack (message){
	var stack = getStack();
	console.log ('%c'+ stack.func +' '+ stack.line +': %c'+ message, debugStyleLog, debugStyleMessage);
}
function logArray (liste){
	if (liste.length ==0) return 'liste vide';
	else if (liste[0].constructor.name == 'String') return liste.join ('\t');
	else if (liste[0].constructor.name == 'Number'){
		for (var n=0; n< liste.length; n++) liste[n] = liste[n].toString();
		return liste.join ('\t');
	}
	else if (liste[0].constructor.name == 'Array'){
		var message ="";
		for (var n=0; n< liste.length; n++) message = message +'\n'+ logArray (liste[n]);
		message = message.slice (1);
		return message;
	}
	else if (liste[0].constructor.name == 'Object'){
		var message ="";
		for (var n=0; n< liste.length; n++) message = message +'\n'+ logDict (liste[n]);
		message = message.slice (1);
		return message;
}}
function logDict (dict){
	var message ="";
	for (var d in dict) message = message +'\t'+d+': '+ dict[d];
	message = message.slice (1);
	return message;
}
const debugAttributes =[ 'class', 'for', 'href', 'id', 'placeholder', 'src', 'style', 'value' ];
function logNode (node){
	var message = node.tagName +'\n';
	for (var a=0; a< debugAttributes.length; a++) if (node.getAttribute (debugAttributes[a])) message = message + debugAttributes[a] +':\t'+ node.getAttribute (debugAttributes[a]) +'\n';
//	if (node.innerText) message = message + 'body:\t' + node.innerText;
	return message;
}
function logObject (object){
	if (object == undefined) pass;
	else if (! object && object.constructor.name != 'Number') message = message +'\tnull';
	else if (object.constructor.name == 'String') return object;
	else if (object.constructor.name == 'Number') return object.toString();
	else if (object.constructor.name == 'Array') return logArray (object);
	else if (object.constructor.name == 'Object') return logDict (object);
	else if (object.constructor.name.slice (0,4) == 'HTML' && object.constructor.name.slice (-7) == 'Element') return logNode (object);
	else if (object.constructor.name.slice (0,3) == 'SVG' && object.constructor.name.slice (-7) == 'Element') return logNode (object);
}
function logCommon(){
	var message ="";
	for (var a=0; a< arguments[0].length; a++) message = message +'\t'+ logObject (arguments[0][a]);
	logStack (message);
}
function debugCondition (condition){
	if (condition){
		var message ="";
		for (var a=1; a< arguments.length; a++) message = message +'\t'+ logObject (arguments[a]);
		logStack (message);
}}
function debugLetter(){
	var n= Math.round (debugNb /26);
	var l= debugNb %26;
	logStack (alphabet[l] +'-'+n)
	debugNb ++;
}
// niveaux de logs
function logError(){ logCommon (arguments); }
function logWarn(){ if (logStates.splice (0, 3).indexOf (logState) >=0) logCommon (arguments); }
function logInfo(){ if (logStates.splice (0, 2).indexOf (logState) >=0) logCommon (arguments); }
function logDebug(){ if (logStates[0] == logState) logCommon (arguments); }
