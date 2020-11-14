
var moduleTest = angular.module ('moduleTest', []);
moduleTest.service ('myService', function(){
	return {
		message: 'Coucou je suis transmit par un service',
		func: function(){ console.log ('Je suis une fonction dans le service'); }
	};
});
var utilitiesStr = angular.module ('utilitiesStr', []);
utilitiesStr.service ('cleanStr', function(){
	function eraseAll (string, strOld){
		let tabString = string.split (strOld);
		let newString = tabString.join ('');
		return newString;
	}
	function replaceAll (string, strOld, strNew){
		let tabString = string.split (strOld);
		let newString = tabString.join (strNew);
		return newString;
	}
	function cleanAll (string){
		string = eraseAll (string, '\r');
		while (string.indexOf ('\n\n') >=0){
			string = replaceAll ('\n\n', '\n');
		}
		while (string.indexOf ('_______') >=0){
			string = replaceAll ('_______', '______');
		}
		while (string.indexOf ('-------') >=0){
			string = replaceAll ('-------', '------');
		}
		return string;
	}
	return {
		clean: cleanAll,
		erase: eraseAll,
		replace: replaceAll
	}
});
utilitiesStr.service ('formatStr', function (cleanStr){
	function uppercaseLineOnePoint (point, line){
		var phraseList = line.split (point +' ');
		for (var i=0; i< phraseList.length; i++){
			var phraseTmp = phraseList[i].charAt (0).toUpperCase() + phraseList[i].slice (1);
			phraseList[i] = phraseTmp;
		}
		var newLine = phraseList.join (point +' ');
		return newLine;
	}
	function uppercaseLineAllPoint (line){
		var pointList =['.', '?', '!', ':', '______', '------'];
		for (var i=0; i< pointList.length; i++){
			line = uppercaseLineOnePoint (pointList[i], line);
			line = cleanStr.replace (line, 'Http', 'http');
		}
		return line;
	}
	function uppercaseText (text){
		var textClean = cleanStr.clean (text);
		var lineList = textClean.split ('\n');
		for (var i=0; i< lineList.length; i++){
			lineList[i] = uppercaseLineAllPoint (lineList[i]);
		}
		return lineList;
	}
	return {
		uppercase: uppercaseLineAllPoint,
		uppercaseText: uppercaseText
	}
});
utilitiesStr.service ('typeStr', function(){
	function isItemList (line){
		var isAnItem = false;
		if (line.substring (0,2) ==='- ') isAnItem = line.substring(2);
		return isAnItem;
	}
	function isLink (line){
		var nameLink = false;
		if (line.substring (0,7) ==='http://' || line.substring (0,8) ==='https://'){
			var listLink = line.split ('/');
			var posLast = listLink.length -1;
			if (! listLink [posLast]) posLast = posLast -1;
			nameLink = listLink [posLast];
			posLast = nameLink.indexOf ('.');
			if (posLast >=0) nameLink = nameLink.substring (0, posLast);
		}
		return nameLink;
	}
	function isTableLine (line){
		var isATableLine = false;
		if (line.indexOf (' , ') >0) isATableLine = line.split (' , ');
		return isATableLine;
	}
	function isImg (line){
		var isAnImg = false;
		var id= line.indexOf (".");
		var extention = line.substring (id);
		var lengthExtention = extention.length;
		if (lengthExtention >=2 && lengthExtention <5) isAnImg = true;
		return isAnImg;
	}
	function isParagraph (line){
		var isAnItem = isItemList (line);
		var isATableLine = isTableLine (line);
		var isALink = isLink (line);
		var isAnImg = isImg (line);
		var isAParagraph = false;
		if (! isAnItem && ! isATableLine && ! isALink && ! isAnImg) isAParagraph = true;
		return isAParagraph;
	}
	return {
		itemList: isItemList,
		link: isLink,
		paragraph: isParagraph,
		tableLine: isTableLine
	}
});
angular.module ('utilitiesStr').filter ('lines', function (formatStr){
return function (text){
	var lineList = formatStr.uppercaseText (text);
	return lineList;
}});
angular.module ('utilitiesStr').filter ('uppercase', function (formatStr){
return function (line){
	line = formatStr.uppercase (line);
	return line;
}});
angular.module ('utilitiesStr').filter ('paragraph', function (typeStr){
return function (line){
	var isLink = typeStr.paragraph (line);
	return isLink;
}});
angular.module ('utilitiesStr').filter ('link', function (typeStr){
return function (line){
	var isLink = typeStr.link (line);
	return isLink;
}});