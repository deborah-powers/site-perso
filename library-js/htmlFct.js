/* transformer du texte avec ma mise en forme spécifique en html. mon markdown perso.
dépend de textFct.js
basé sur python/htmlFct.py
*/
const toReplace =[[ '\ncode\n', '\nCode\n' ], [ '\ncode: ', '\nCode: ' ], [ '\nfig\n', '\nFig\n' ]];
const listTagsContainer =[ 'ul', 'ol', 'dl', 'table', 'nav', 'div', 'fieldset', 'form', 'figure', 'math', 'section', 'article', 'body', 'header', 'footer', 'main' ]
const listTagsIntern =[ 'i', 'b', 'em', 'span', 'strong', 'thead', 'tbody' ]
const tagHtml =[
	['\n<h1>', '\n== '], ['\n<h2>', '\n** '], ['\n<h3>', '\n-- '], ['\n<h4>', '\n__ '], ['\n<h5>', '\n## '], ['\n<h6>', '\n++ '],
	["\n<hr class='h1'/>\n", '\n==\n'], ["\n<hr class='h2'/>\n", '\n**\n'], ["\n<hr class='h3'/>\n", '\n--\n'],
	["\n<hr>\n", '\n**\n'], ["\n<hr/>\n", '\n**\n'],
	['\n<figure>', '\nFig\n'], ['\n<xmp>!', '\nCode\n'], ['\n<xmp>: ', '\nCode: '], ['\n<li>', '\n\t']
]
const protocols =[ 'https://', 'http://', 'file:///' ];

String.prototype.toHtml = function(){
	var text = this.cleanTxt();
	// transformer la mise en page en balises
	text = '\n' + text + '\n';
	for (tag of toReplace) text = text.replaceAll (tag[0], tag[1]);
	text = text.toSql();
	for (tag of tagHtml) text = text.replaceAll (tag[1], tag[0]);
	// compléter les tîtres
	const textList = text.split ('\n');
	for (var l=0; l< textList.length; l++){
		if (textList[l].substring (0,2) !== '<h' || textList[l][3] !== '>' || ! '123456'.includes (textList[l][2])) continue;
		textList[l] = textList[l] +'</h'+ textList[l][2] +'>';
	}
	text = textList.join ('\n');
	// autres modifications
	text = text.toCode();
	text = text.toList();
	text = text.toTable();
	text = text.toDefList();
	text = text.cleanBasic();
	text = text.toEmphasis();
	// rajouter les <p/>
	text = text.replaceAll ('\n', '</p><p>');
	text = text.replaceAll ('></p><p><', '><');
	text = text.replaceAll ('></p><p>', '><p>');
	text = text.replaceAll ('</p><p><', '</p><');
	// rajouter d'eventuel <p/> s'il n'y a pas de balise en debut ou fin de text
	if (text[0] !=='<') text = '<p>'+ text;
	if (text.substring (text.length -1) !=='>') text = text +'</p>';
	// autres modifications
	text = text.toImage();
	text = text.toLink();
	text = text.toFigure();
	// restaurer le texte, remplacer mes placeholders
	text = text.replaceAll ('ht/tp', 'http');
	text = text.replaceAll ('fi/le', 'file');
	text = text.cleanHtml();
	text = text.replaceAll ('/$', '\n');
	text = text.replaceAll ('\\f', '\t');
	return text;
}
String.prototype.toCode = function(){
	if (! this.includes ('<xmp>')) return this;
	var text ="";
	if (this.includes ('<xmp>:')){
		const textList = this.split ('\n<xmp>:');
		for (var t=1; t< textList.length; t++) textList[t] = textList[t].replace ('\n', '</xmp>');
		text = textList.join ('<xmp>');
	}
	else text = this;
	if (text.includes ('<xmp>!')){
		const textList = text.split ('<xmp>!');
		for (var t=1; t< textList.length; t++){
			var posEnd = textList[t].indexOf ('\n/\n');
			var textTmp = textList[t].substring (0, posEnd).strip();
			textTmp = textTmp.replaceAll ('\n', '/$');
			textTmp = textTmp.replaceAll ('\t', '\\f');
			textTmp = textTmp +'</xmp>';
			textList[t] = textTmp + textList[t].substring (posEnd +3).strip();
		}
		text = textList.join ('<xmp>');
	}
	return text;
}
String.prototype.toFigure = function(){
	if (! this.includes ('<figure>')) return this;
	const textList = this.split ('<figure>');
	for (var t=1; t< textList.length; t++){
		var posEnd = textList[t].indexOf ('<p>/</p>');
		var textTmp = textList[t].substring (0, posEnd).strip();
		textTmp = textTmp.replaceAll ('/></p>', '/>');
		textTmp = textTmp.replace ('<p>', '<figcaption>');
		textTmp = textTmp.replace ('</p>', '</figcaption>');
		textList[t] = textTmp + '</figure>' + textList[t].substring (posEnd +8).strip();
	}
	const text = textList.join ('<figure>');
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
String.prototype.toDefList = function(){
	if (! this.includes (": ")) return this;
	const textList = this.split ('\n');
	const textListLen = textList.length;
	var d=-1; var t=0;
	while (t< textListLen){
		if (textList[t].includes (": ") && textList[t].count (": ") ===1 && d===-1) d=t;
		else if (! textList[t].includes (": ") && d>=0){
			if (t-d >1){
				for (var l=d; l<t; l++) textList[l] = '<dt>' + textList[l].replace (": ", '</dt><dd>') + '</dd>';
				textList[d] = textList[d].replace ('<dt>', '<dl><dt>');
				textList[t-1] = textList[t-1].replace ('</dd>', '</dd></dl>');
			} d=-1;
		} t+=1;
	}
	text = textList.join ('\n');
	text = text.replaceAll ('\n<dt>', '<dt>')
	text = text.replaceAll ('</dd>\n', '<dd>')
	return text;
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
			if (textList[i].includes ('\t')){
				c= textList[i].count ('\t');
				d=i; i+=1;
			}
			while (i< textList.length && textList[i].count ('\t') ===c) i+=1;
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
				textList[d] = '<table>' + textList[d];
				textList [i-1] = textList [i-1] +'</table>';
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
String.prototype.toLink = function(){
	var text = this;
	for (var protocol of protocols) text = text.toLinkProtocol (protocol);
	return text;
}
String.prototype.toLinkProtocol = function (protocol){
	if (! this.includes (protocol)) return this;
	const endingChars = '<;, !\t\n';
	var textList = this.split (protocol);
	for (var p=1; p< textList.length; p++){
		// récupérer l'url
		var paragraphTmp = textList[p];
		var posEnd =-1;
		for (var c=0; c< endingChars.length; c++) if (paragraphTmp.includes (endingChars[c])){
			posEnd = paragraphTmp.indexOf (endingChars[c]);
			paragraphTmp = paragraphTmp.substring (0, posEnd);
		}
		paragraphTmp = paragraphTmp.strip ('/');
		textList[p] = textList[p].substring (posEnd);
		// calculer le tître
		var title ="";
		if (' (' === textList[p].substring (0,2)){
			posEnd = textList[p].indexOf (')');
			title = textList[p].substring (2, posEnd);
			textList[p] = textList[p].substring (posEnd +1);
		}
		else if (': '=== textList[p-1].substring (textList[p-1].length -2)){
			posEnd = textList[p-1].length -2;
			posStart =3+ textList[p-1].lastIndexOf ('<p>');
			title = textList[p-1].substring (posStart, posEnd);
			if (title.includes ('>') || title.includes ('<')) title = paragraphTmp.findTitleFromUrl();
			else textList[p-1] = textList[p-1].substring (0, posStart);
		}
		else title = paragraphTmp.findTitleFromUrl();
		textList[p] = paragraphTmp +"'>"+ title +'</a> '+ textList[p];
	}
	var text = textList.join (" <a href='" + protocol);
	text = text.replaceAll ('> <a ', '><a ');
	text = text.replaceAll ('</a> <', '</a><');
	return text;
}
String.prototype.toImage = function(){
	// traiter les images
	var text = this;
	for (var protocol of protocols) for (var extension of imgExtension){
		text = text.toImageProtocolExtension (protocol, extension);
	}
	return text;
}
String.prototype.toImageProtocolExtension = function (protocol, extension){
	extension = '.'+ extension;
	if (! this.includes (protocol) || ! this.includes (extension)) return this;
	const endingChars = '<>;, "!\t\n\t\'';
	var textList = this.split (extension);
	for (var i=0; i< textList.length -1; i++){
		// éliminer les cas ne concernant pas le protocole
		if (! textList[i].includes (protocol)) continue;
		var posEnd = textList[i].lastIndexOf (protocol);
		var url = textList[i].substring (posEnd);
		for (var char of endingChars) if (url.includes (char)){ posEnd =-1; }
		if (posEnd ===-1) continue;
		textList[i] = textList[i].substring (0, posEnd);
		url = url + extension;
		// trouver la description
		var title ="";
		if (textList[i+1].substring (0,2) === " ("){
			posEnd = textList[i+1].indexOf (')');
			title = textList[i+1].substring (2, posEnd);
			textList[i+1] = textList[i+1].substring (posEnd +1);
		}
		else if (': '=== textList[i].substringEnd (2)){
			posEnd = textList[i].length -2;
			var posStart =3+ textList[i].lastIndexOf ('<p>');
			title = textList[i].substring (posStart, posEnd);
			if (title.includes ('>') || title.includes ('<')) title = url.findTitleFromUrl();
			else textList[i] = textList[i].substring (0, posStart);
		}
		else title = url.findTitleFromUrl();
		url = url.replace ('http', 'ht/tp');
		url = url.replace ('file', 'fi/le');
		url = "<img src='" + url + "' alt='" + title +"' />";
		textList[i] = textList[i] + url;
	}
	text = textList.join (extension);
	text = text.replaceAll ('/>' + extension, '/>');
	return text;
}
String.prototype.findTitleFromUrl = function(){
	var pos = this.lastIndexOf ('/');
	if (this.includes ('\\')) pos = this.lastIndexOf ('\\');
	pos +=1;
	var title = this.substring (pos);
	if (title.includes ('.gouv.fr')){
		pos = title.lastIndexOf ('.gouv.fr');
		title = title.substring (0, pos);
	}
	else if (title.includes ('.')){
		pos = title.lastIndexOf ('.');
		title = title.substring (0, pos);
	}
	title = title.replaceAll ('www.',"");
	const urlWords =[ '-', '_', '.', '?', '#', '%20' ];
	for (var w=0; w< urlWords.length; w++) title = title.replaceAll (urlWords[w]," ");
	title = title.cleanTitle();
	return title;
}
function findTitle(){
	const titleTag = document.head.getElementsByTagName ('title')[0];
	var title ="";
	if (titleTag === undefined || titleTag.innerText.isEmpty()) title = window.location.href.findTitleFromUrl();
	else title = titleTag.innerText.cleanTitle();
	return title;
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
HTMLPreElement.prototype.computeWidth = function(){
	var text = this.innerHTML.replaceAll ('\n', " ");
	while (text.includes ("  ")) text = text.replaceAll ("  ", " ");
	var widthPx = window.getComputedStyle (this).width;
	widthPx = widthPx.substring (0, widthPx.length -2);
	var widthLineMax = parseFloat (widthPx);
	widthLineMax /=10.0;
	if (text.length > widthLineMax){
		// couper les lignes au niveau de marqueurs
	//	const artefacts =[ ['> ','>\n'], [' <', '\n<'], ['; ',';\n'], ['} ','}\n' ], [' }','\n}'], ['{ ','{\n'], ['] ',']\n'] ];
		const artefacts =[ ['> ','>\n'], [' <', '\n<'], ['; ',';\n'], ['): ','):\n'], ['){ ','){\n'] ];
		for (var char of artefacts) text = text.replaceAll (char[0], char[1]);
		// ajuster les lignes restantes selon les espaces
		var textList = text.split ('\n');
		for (var l=0; l< textList.length; l++) if (textList[l].length > widthLineMax){
			var pos =0;
			var smallList =[];
			while (textList[l].length > widthLineMax){
				const smallText = textList[l].substring (0, widthLineMax);
				pos =1+ smallText.lastIndexOf ("} ");
				if (pos < widthLineMax *0.9) pos =1+ smallText.lastIndexOf ("{ ");
				if (pos < widthLineMax *0.9) pos =1+ smallText.lastIndexOf ("] ");
				if (pos < widthLineMax *0.9) pos =1+ smallText.lastIndexOf (": ");
				if (pos < widthLineMax *0.9) pos = smallText.lastIndexOf (" ");
				smallList.push (textList[l].substring (0, pos));
				textList[l] = textList[l].substring (pos +1);
			}
			smallList.push (textList[l]);
			textList[l] = smallList.join ('\n');
		}
		text = textList.join ('\n');
	}
	this.innerHTML = text;
}
function resizeCodeBlocks(){
	const pres = document.getElementsByTagName ('xmp');
	for (var pre of pres) pre.computeWidth();
}
window.onresize = resizeCodeBlocks;

/* ------------------------ trouver les métadonnées ------------------------ */

function prepareText(){
	var metaText ="";
	var text = document.body.children[0].innerHTML;
	text = text.cleanTxt();
	// trouver les métadonnées
	// trouver la fin du texte, qui contient les métadonnées
	if (text.includes ('\n==\n')
		&& (text.includes ('\nJs: ') || text.includes ('\nJs bas: ') || metaText.includes ('\nScript:\n')
			|| text.includes ('\nCss: ') || text.includes (' {') || text.includes (': '))){
		const d= text.lastIndexOf ('\n==\n');
		var metaText = text.substring (d+4).strip();
		if (metaText.includes ('\nJs: ') || metaText.includes ('\nJs bas: ') || metaText.includes ('\nScript:\n')
			|| metaText.includes ('\nCss: ') || metaText.includes (' {') || metaText.includes (': '))
			text = text.substring (0,d);
	}
	// transformer le texte en html
	text = text.toHtml();
	text = text.toHtmlShapes();
	// récupérer les métadonnées
	var meta ={};
	if (metaText !==""){
		var textList = metaText.findScriptInterne();
		if (textList[1] !=="") text = text + textList[1];
		metaText = textList[0].toLowerCase();
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
	var meta ={ lien: "", sujet: 'divers', auteur: 'anonyme' };
	var d=0;
	var label ="";
	for (line of textList){
		d= line.indexOf (': ');
		if (line.length >d+3){
			label = line.substring (0,d);
			if ([ 'lien', 'link' ].includes (label)) meta['lien'] = line.substring (d+2);
			else if ([ 'subject', 'sujet' ].includes (label)) meta['sujet'] = line.substring (d+2);
			else if ([ 'author', 'auteur' ].includes (label)) meta['auteur'] = line.substring (d+2);
			else if ([ 'autlink', 'laut', 'lien-auteur' ].includes (label)) meta['autlink'] = line.substring (d+2);
			else meta [line.substring (0,d)] = line.substring (d+2);
	}}
	return meta;
}
String.prototype.findCssInterne = function(){
	if (this.includes (' {')){
		var d= this.indexOf (' {', d);
		d= this.substring (0,d).lastIndexOf ('\n');
		var css = this.substring (d).strip();
		css = "<style type='text/css'>" + css + '</style>';
		document.head.innerHTML = document.head.innerHTML + css;
		d= this.indexOf ('\nstyle\n');
		return this.substring (0,d).strip();
	}
	else return this;
}
String.prototype.findCssExterne = function(){
	if (this.includes ('\ncss: ')){
		var css ="";
		const textList = this.split ('\ncss: ');
		for (var s=1; s< textList.length; s++) css = css + "<link rel='stylesheet' type='text/css' href='" + textList[s] + "'/>";
		document.head.innerHTML = document.head.innerHTML + css;
		return textList[0].strip();
	}
	else return this;
}
String.prototype.findScriptBas = function(){
	if (this.includes ('\njs bas: ')){
		var codes ="";
		const textList = this.split ('\njs bas: ');
		for (var s=1; s< textList.length; s++) codes = codes + "<script type='text/javascript' src='" + textList[s] + "'></script>";
		document.body.innerHTML = document.body.innerHTML +'\n'+ codes;
		return [ textList[0].strip(), codes ];
	}
	else return [ this, "" ];
}
String.prototype.findScript = function(){
	if (this.includes ('\njs: ')){
		var codes ="";
		const textList = this.split ('\njs: ');
		for (var s=1; s< textList.length; s++) codes = codes + "<script type='text/javascript' src='" + textList[s] + "'></script>";
		document.head.innerHTML = document.head.innerHTML + codes;
		return textList[0].strip();
	}
	else return this;
}
String.prototype.findScriptInterne = function(){
	if (this.includes ('\nScript\n')){
		const d= this.indexOf ('\nScript\n');
		const code = "<script type='text/javascript'>" + this.substring (d+9).strip() + '</script>';
		return [ this.substring (0,d), code ];
	}
	else return [ this, "" ];
}
String.prototype.cleanHtml = function(){
	var text = this.cleanBasic();
	text = text.replaceAll ('\n', "");
	text = text.replaceAll ('\t', "");
	while (text.includes ("  ")) text = text.replaceAll ("  "," ");
	// nettoyer les balises
	text = text.replaceAll ('> ','>');
	text = text.replaceAll (' <','<');
	text = text.replaceAll ('<br>', '<br/>');
	text = text.replaceAll ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replaceAll ('<br/><br/>', '<br/>');
	const tagHtmlBis =[ 'span', 'strong', 'em', 'b', 'p', 'h1', 'h2', 'h3', 'h4', 'div', 'section', 'article', 'tr', 'caption', 'table', 'figcaption', 'figure', 'nav', 'aside', 'xmp' ];
	for (var tag of tagHtmlBis) text = text.replaceAll ('<'+ tag +'></'+ tag +'>', "");
	text = text.replaceAll ('</pre>','</xmp>');
	text = text.replaceAll ('<pre>','<xmp>');
	text = text.replaceAll ('<pre ','<xmp ');
	text = text.replaceAll ('</code>','</xmp>');
	text = text.replaceAll ('<code>','<xmp>');
	text = text.replaceAll ('<code ','<xmp ');
	text = text.replaceAll ('>','> ');
	text = text.replaceAll ('<',' <');
	text = text.replaceAll ('>  <','><');
	text = text.replaceAll (' </', '</');
	for (var tag of tagHtmlBis) text = text.replaceAll ('<'+ tag +'> ', '<'+ tag +'>');
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

