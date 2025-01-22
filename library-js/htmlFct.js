/* transformer du texte avec ma mise en forme spécifique en html. mon markdown perso.
dépend de textFct.js
basé sur python/htmlFct.py
*/
const tagHtml =[
	['\n<h1>', '\n=== '], ['</h1>\n', ' ===\n'], ['\n<h2>', '\n*** '], ['</h2>\n', ' ***\n'], ['\n<h3>', '\n--- '], ['</h3>\n', ' ---\n'], ['\n<h4>', '\n___ '], ['</h4>\n', ' ___\n'],
	['\n<hr>', '\n\n***\n\n'], ["\n<img src='", '\nImg\t'], ['\n<figure>', '\nFig\n'], ['</figure>', '\n/fig\n'], ['\n<xmp>', '\ncode\n'], ['</xmp>', '\n/code\n'],
	['\n<li>', '\n\t']
];
String.prototype.toHtml = function(){
	var text = this.cleanTxt();
	// transformer la mise en page en balises
	text = '\n' + text + '\n';
	text = text.toSql();
	for (tag of tagHtml) if (text.includes (tag[1])){ text = text.replaceAll (tag[1], tag[0]); }
	// autres modifications
	text = text.toList();
	text = text.toTable();
	text = text.cleanBasic();
	text = text.toEmphasis();
	// rajouter les <p/>
	text = text.replaceAll ('\n', '</p><p>');
	text = text.replaceAll ('></p><p><', '><');
	text = text.replaceAll ('></p><p>', '><p>');
	text = text.replaceAll ('</p><p><', '</p><');
	// rajouter d'eventuel <p/> s'il n'y a pas de balise en debut ou fin de text
	if (! text.substring (0,3).includes ('<')) text = '<p>'+ text;
	if (! text.substring (text.length -3).includes ('>')) text = text +'</p>';
	// autres modifications
	text = text.toImage();
	text = text.toLink();
	// restaurer le texte, remplacer mes placeholders
	text = text.replaceAll ('ht/tp', 'http');
	text = text.cleanHtml();
	text = text.replaceAll ('/$', '\n');
	text = text.replaceAll ('\\f', '\t');
	return text;
}
String.prototype.toList = function(){
	if (this.includes ('<li>')){
		var text = this.replaceAll ('<li>', '<ul><li>');
		var textList = text.split ('\n');
		// rajouter les balises fermantes
		for (var l=0; l< textList.length; l++) if (textList[l].substring (0,8) === '<ul><li>'){ textList[l] = textList[l] + '</li></ul>'; }
		// mettre le texte au propre
		text = textList.join ('\n');
		text = text.replaceAll ('</li></ul>\n<ul><li>', '</li><li>');
		// les niveau d'imbrication
		while (text.includes ('<li>\t')){
			textList = text.split ('<li>\t');
			for (var t=1; t< textList.length; t++){
				if (textList[t-1].includes ('<li>')) textList[t-1] = textList[t-1] + '<li><ul>';
				else if (textList[t].includes ('<li>')) textList[t] = textList[t].replace ('</li>', '</li></ul></li>');
			}
			text = textList.join ('<li>');
		}
		// les liste ordonnées
		while (text.includes ('<li># ')){
			var d= text.indexOf ('<li># ');
			d= text.substring (0,d).lastIndexOf ('<ul>');
			text = text.substring (0,d) + '<ol>' + text.substring (d+4);
			var f= text.indexOf ('</ul>', d);
			while (text.substring (d,f).count ('<ul>') != text.substring (d,f).count ('</ul>')) f= text.indexOf ('</ul>', f+4);
			text = text.substring (0,f) + '</ol>' + text.substring (f+5);
			text = text.replace ('<li># ', '<li>');
		}
		text = text.strip();
		return text;
	}
	else return this;
}
String.prototype.toTable = function(){
	if (this.includes ('\t')){
		var text = this.replaceAll ('\t\t', '\t');
		while (text.includes ('\t\t')) text = text.replaceAll ('\t\t', '\t');
		var textList = text.split ('\n');
		var d=-1; var c=-1; var i=0;
		while (i< textList.length){
			// rechercher une table
			d=-1; c=-1;
			if (d==-1 && c==-1 && textList[i].includes ('\t')){
				c= textList[i].count ('\t');
				d=i; i+=1;
			}
			while (i< textList.length && textList[i].count ('\t') ==c) i+=1;
			c=i-d;
			// une table a ete trouve
			if (c>1 && d>0){
				for (var j=d; j<i; j++){
					// entre les cases
					textList[j] = textList[j].replaceAll ('\t', '</td><td>');
					// bordure des cases
					textList[j] = '<tr><td>' + textList[j] +'</td></tr>';
				}
				// les limites de la table
				textList[d] = '<table>\n' + textList[d];
				textList [i-1] = textList [i-1] +'\n</table>';
			}
			i+=1;
		}
		text = textList.join ('\n');
		// les titres de colonnes ou de lignes
		if (text.includes (':</td></tr>')){
			textList = text.split (':</td></tr>');
			for (var p=0; p<textList.length -1; p++){
				d= textList[p].lastIndexOf ('<tr><td>');
				textList[p] = textList[p].substring (0,d) +'<tr><th>'+ textList[p].substring (d+8).replaceAll ('td>', 'th>');
			}
			text = textList.join ('</th></tr>');
		}
		if (text.includes (':</td>')){
			textList = text.split (':</td>');
			for (var p=0; p<textList.length -1; p++){
				d= textList[p].lastIndexOf ('<td>');
				textList[p] = textList[p].substring (0,d) +'<th>'+ textList[p].substring (d+4);
			}
			text = textList.join ('</th>');
		}
		text = text.replaceAll ('\t', "");
		text = text.replaceAll ('<td>.</td>', '<td></td>');
		return text;
	}
	else return this;
}
String.prototype.toImage = function(){
	var text = this;
	for (var h=0; h< imgExtension.length; h++){
		if (text.includes ('.'+ imgExtension[h])){
			var textList = text.split ('.'+ imgExtension[h]);
			for (var i=0; i<textList.length -1; i++){
				var d= textList[i].lastIndexOf (':');
				var f= textList[i].substring (0,d).lastIndexOf (' ');
				for (var p=2; p< punctuation.length; p++){
					var e= textList[i].substring (0,d).lastIndexOf (punctuation[p]);
					if (e>f) f=e;
				}
				for (var char of brackets){
					var e= textList[i].substring (0,d).lastIndexOf (char);
					if (e>f) f=e;
				}
				if (textList[i].substring (0,d).includes ('>')){
					var e= textList[i].substring (0,d).lastIndexOf ('>');
					if (e>f) f=e;
				}
				f=f+1;
				var title = textList[i].substring (f+1).replaceAll ('-'," ");
				if (textList[i+1].substring (0,2) === ' ('){
					var e= textList[i+1].indexOf (')');
					title = textList[i+1].substring (2,e);
					textList[i+1] = textList[i+1].substring (e+1);
					title = title.replaceAll ('-'," ");
				}else{
					if (title.includes ('/')){
						d=1+ title.lastIndexOf ('/');
						title = title.substring (d);
					}
					if (title.includes ('\\')){
						d=1+ title.lastIndexOf ('\\');
						title = title.substring (d);
					}
					if (title.includes ('.')){
						d=1+ title.indexOf ('.');
						title = title.substring (d);
					}
					title = title.cleanTxt();
				}
				title = title.replaceAll ('_'," ");
				textList[i] = textList[i].substring (0,f) + "<img src='" + textList[i].substring (f).replaceAll ('http', 'ht/tp') +"."+ imgExtension[h] +"' alt='" + title +"'/>";
			}
			text = textList.join ("");
	}}
	return text;
}
String.prototype.toLink = function(){
	var text = this.toLinkProtocol ('http');
	text = text.replaceAll ('C:/', 'file:///C:/')
	text = text.replaceAll ('C:\\', 'file:///C:\\')
	text = text.toLinkProtocol ('file:///')
	return text;
}
String.prototype.toLinkProtocol = function (protocol){
	if (this.includes (protocol)){
		const endingChars = '<;, !\t\n';
		var textList = this.split (protocol);
		for (var p=1; p< textList.length; p++){
			var textTmp = textList[p];
			var d=-1; var e=-1; var f=-1;
			for (var c=0; c< endingChars.length; c++) if (textTmp.includes (endingChars[c])){
				f= textTmp.indexOf (endingChars[c]);
				textTmp = textTmp.substring (0,f);
			}
			textTmp = textTmp.strip ('/');
			d= textTmp.lastIndexOf ('/') +1;
			e= textTmp.length;
			if (textTmp.substring (d).includes ('.')) e= textTmp.lastIndexOf ('.');
			var title ="";
			if (textList[p].substring (f,f+2) === ' ('){
				e= textList[p].indexOf (')');
				title = textList[p].substring (f+2, e);
				textList[p] = textList[p].substring (e+1);
			}else{
				title = textTmp.substring (d,e).replaceAll ('-',' ');
				title = title.replaceAll ('_',' ');
				title = title.replaceAll ('.',' ');
				title = title.replaceAll ('?',' ');
				textList[p] = textList[p].substring (f);
			}
			textList[p] = textTmp +"'>"+ title +'</a> '+ textList[p];
		}
		var text = textList.join (" <a href='" + protocol);
		text = text.replaceAll ('> <a ', '><a ');
		text = text.replaceAll ('</a> <', '</a><');
		return text;
	}
	else return this;
}
String.prototype.toEmphasis = function(){
	if (this.includes ('\n* ')){
		var textList = this.split ('\n* ');
		// rajouter les balises fermantes
		for (var l=0; l< textList.length; l++) if (textList[l].substring (1,100).includes (': ')){
			textList[l] = textList[l].replaceAll (': ',':</strong> ');
			textList[l] = '<strong>' + textList[l];
		}
		text = textList.join ('\n');
		return text;
	}
	else return this;
}
String.prototype.toHtmlShapes = function(){
	// le texte à été préalablement transformé par toHtml. shape.css contient le style correspondant aux balises créées.
	var text = this;
	if (text.includes ('<-->')) text = text.replaceAll ('<-->', "<hr class='arrow horizontal'/>");
	if (text.includes ('-->')) text = text.replaceAll ('-->', "<hr class='arrow'/>");
	if (text.includes ('<--')) text = text.replaceAll ('<--', "<hr class='arrow left'/>");
	return text;
}
String.prototype.setXmpWidth = function(){
	var text = this.replaceAll ('/$', '\n');
	while (text.includes ('\n\n')) text = text.replaceAll ('\n\n', '\n');
	while (text.includes ("  ")) text = text.replaceAll ("  ", "  ");
	while (text.includes ('\t\t')) text = text.replaceAll ('\t\t', '\t');
	text = text.strip();
	const xmpBlock = text.split ('\n');
	var xmpLine =[];
	var textTmp ="";
	for (var b=0; b< xmpBlock.length; b++){
		if (xmpBlock[b].length >100 && xmpBlock[b].includes (" ")){
			xmpLine = xmpBlock[b].split (" ");
			xmpBlock[b] ="";
			for (var l=0; l< xmpLine.length; l++){
				if (textTmp.length <100){
					textTmp = textTmp +" "+ xmpLine[l];
					if (l=== xmpLine.length -1) xmpBlock[b] = xmpBlock[b] +'\n '+ textTmp;
				}else{
					xmpBlock[b] = xmpBlock[b] +'\n '+ textTmp;
					textTmp = xmpLine[l];
	}}}}
	text = xmpBlock.join ('\n');
	while (text.includes ('\n\n')) text = text.replaceAll ('\n\n', '\n');
	text = text.strip();
	text = text.replaceAll ('\n', '/$');
	return text;
}
String.prototype.toSqlOne = function (word){
	text = this.replaceAll ('\n'+ word[0].toUpperCase() + word.substring (1) +" ", '\n'+ word +" ");
	if (text.includes ('\n'+ word +" ") && text.includes (';')){
		const textList = text.split ('\n'+ word +" ");
		var f=0; var tmpReq ="";
		for (var l=1; l< textList.length; l++){
			if (textList[l].includes (';')){
				f=1+ textList[l].indexOf (';');
				tmpReq = textList[l].substring (0,f);
				if (tmpReq.includes ('\n')){
					tmpReq = tmpReq.replaceAll ('\n','/$');
					while (tmpReq.includes ('/$/$')) tmpReq = tmpReq.replaceAll ('/$/$','/$');
					tmpReq = tmpReq.toLowerCase();
					tmpReq = word +" "+ tmpReq;
					tmpReq = tmpReq.setXmpWidth();
					textList[l] = textList[l].substring (f);
					textList[l] = '<xmp>' + tmpReq + '</xmp>' + textList[l];
				}
				else textList[l] = word +" "+ textList[l];
			}
			else textList[l] = word +" "+ textList[l];
		}
		text = textList.join ('\n');
	}
	return text;
}
String.prototype.toSql = function(){
	// repérer les blocs de code sql.
	// avant de rajouter les balises html de base.
	var text = this.replaceAll (' ;',';');
	text = text.replaceAll ('\n;',';');
	text = text.toSqlOne ('with tmp_');
	text = text.toSqlOne ('create or replace');
	text = text.toSqlOne ('select');
	return text;
}
/* ------------------------ trouver les métadonnées ------------------------ */

function prepareText(){
	var metaText ="";
	var text = document.body.children[0].innerHTML;
	text = text.cleanTxt();
	// trouver les métadonnées
	// trouver la fin du texte, qui contient les métadonnées
	if (text.includes ('\n===\n')
		&& (text.includes ('\nScript:\t') || text.includes ('\nScript bas:\t') || metaText.includes ('\nScript:\n')
			|| text.includes ('\nStyle:\t') || text.includes (' {') || text.includes (':\t'))){
		const d= text.lastIndexOf ('\n===\n');
		metaText = text.substring (d+5).strip();
		if (metaText.includes ('\nScript:\t') || metaText.includes ('\nScript bas:\t') || metaText.includes ('\nScript:\n')
			|| metaText.includes ('\nStyle:\t') || metaText.includes (' {') || metaText.includes (':\t'))
			text = text.substring (0,d).strip();
	}
	// transformer le texte en html
	text = text.toHtml();
	text = text.toHtmlShapes();
	// récupérer les métadonnées
	var meta ={};
	if (metaText !==""){
		var textList = metaText.findScriptInterne();
		if (textList[1] !=="") text = text + textList[1];
		var metaText = textList[0].toLowerCase();
		metaText = metaText.findCssInterne();
		metaText = metaText.findCssExterne();
		textList = metaText.findScriptBas();
		if (textList[1] !=="") text = text + textList[1];
		metaText = textList[0].findScript();
		meta = metaText.findMetadata();
	}
	document.body.innerHTML = text.strip();
	return meta;
}
String.prototype.printMetadata = function (meta){
	// this = <p>$metaName</p>
	var text = this.replaceAll ('\n',"");
	for (const [key, value] of Object.entries (meta)) text = text.replace ('$'+ key, value);
	return text;
}
String.prototype.findMetadata = function(){
	const textList = this.split ('\n');
	var meta ={};
	var d=0;
	for (line of textList){
		d= line.indexOf (':\t');
		meta [line.substring (0,d)] = line.substring (d+2);
	}
	return meta;
}
String.prototype.findCssInterne = function(){
	if (this.includes (' {')){
		var d= this.indexOf (' {', d);
		d= this.substring (0,d).lastIndexOf ('\n');
		var css = this.substring (d).strip();
		css = "<style type='text/css'>" + css + '</style>';
		document.head.innerHTML = document.head.innerHTML + css;
		return this.substring (0,d).strip();
	}
	else return this;
}
String.prototype.findCssExterne = function(){
	if (this.includes ('\nstyle:\t')){
		var css ="";
		const textList = this.split ('\nstyle:\t');
		for (var s=1; s< textList.length; s++) css = css + "<link rel='stylesheet' type='text/css' href='" + textList[s] + "'/>";
		document.head.innerHTML = document.head.innerHTML + css;
		return textList[0].strip();
	}
	else return this;
}
String.prototype.findScriptBas = function(){
	if (this.includes ('\nscript bas:\t')){
		var codes ="";
		const textList = this.split ('\nscript bas:\t');
		for (var s=1; s< textList.length; s++) codes = codes + "<script type='text/javascript' src='" + textList[s] + "'></script>";
		document.body.innerHTML = document.body.innerHTML +'\n'+ codes;
		return [ textList[0].strip(), codes ];
	}
	else return [ this, "" ];
}
String.prototype.findScript = function(){
	if (this.includes ('\nscript:\t')){
		var codes ="";
		const textList = this.split ('\nscript:\t');
		for (var s=1; s< textList.length; s++) codes = codes + "<script type='text/javascript' src='" + textList[s] + "'></script>";
		document.head.innerHTML = document.head.innerHTML + codes;
		return textList[0].strip();
	}
	else return this;
}
String.prototype.findScriptInterne = function(){
	if (this.includes ('\nScript:\n')){
		const d= this.indexOf ('\nScript:\n');
		const code = "<script type='text/javascript'>" + this.substring (d+9).strip() + '</script>';
		return [ this.substring (0,d), code ];
	}
	else return [ this, "" ];
}
String.prototype.cleanHtml = function(){
	var text = this.replaceAll ('\n', "");
	text = text.replaceAll ('\t', "");
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	// nettoyer les balises
	text = text.replaceAll ('> ','>');
	text = text.replaceAll (' <','<');
	text = text.replaceAll ('<br>', '<br/>');
	text = text.replaceAll ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replaceAll ('<br/><br/>', '<br/>');
	const tagHtml =
	[ 'span', 'strong', 'em', 'b', 'p', 'h1', 'h2', 'h3', 'h4', 'div', 'section', 'article', 'tr', 'caption', 'table', 'figcaption', 'figure', 'nav', 'aside', 'xmp' ];
	for (var tag of tagHtml) text = text.replaceAll ('<'+ tag +'></'+ tag +'>', "");
	text = text.replaceAll ('>','> ');
	text = text.replaceAll ('<',' <');
	text = text.replaceAll ('>  <','><');
	text = text.replaceAll (' </', '</');
	for (var tag of tagHtml) text = text.replaceAll ('<'+ tag +'> ', '<'+ tag +'>');
	return text;
}
HTMLElement.prototype.fromText = function (text){
	text = text.toHtml();
	this.innerHTML = text;
}
HTMLHeadElement.prototype.linkOpeningMethod = function(){
	var baseElement = document.getElementsByTagName ('base')[0];
	if (baseElement === undefined){
		baseElement = document.createElement ('base');
		this.appendChild (baseElement);
	}
	baseElement.target = '_blank';
}
document.head.linkOpeningMethod();