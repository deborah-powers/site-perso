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
	for (tag of tagHtml) if (text.includes (tag[1])){ text = text.replaceAll (tag[1], tag[0]); }
	// autres modifications
	text = text.toList();
	text = text.toTable();
	text = text.cleanTxt();
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
	text = text.replaceAll ('\\a', '\n');
	text = text.replaceAll ('\\f', '\t');
	text = text.cleanHtml();
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
		var textList = this.split ('\n');
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
			textList = text.split ('.'+ imgExtension[h]);
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
		}
	}
	return text;
}
String.prototype.toLink = function(){
	if (this.includes ('http')){
		const endingChars = '<;, !\t\n';
		var textList = this.split ('http');
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
			}
			else{
				title = textTmp.substring (d,e).replaceAll ('-',' ');
				title = title.replaceAll ('_',' ');
				title = title.replaceAll ('-',' ');
				textList[p] = textList[p].substring (f);
			}
			textList[p] = textTmp +"'>"+ title +'</a> '+ textList[p];
		}
		var text = textList.join (" <a href='http");
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
String.prototype.cleanHtml = function(){
	var text = this.replaceAll ('\n', "");
	text = text.replaceAll ('\t', "");
	text = text.cleanTxt();
	// nettoyer les balises
	text = text.replaceAll ('> ','>');
	text = text.replaceAll (' <','<');
	text = text.replaceAll ('<br>', '<br/>');
	text = text.replaceAll ('<hr>', '<hr/>');
	while (text.includes ('<br/><br/>')) text = text.replaceAll ('<br/><br/>', '<br/>');
	const tagHtml =
	[ 'span', 'strong', 'em', 'b', 'p', 'h1', 'h2', 'h3', 'h4', 'div', 'section', 'article', 'tr', 'caption', 'table', 'figcaption', 'figure', 'nav', 'aside' ];
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