// fonctionne avec text.js
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZaàâbcdeéêèëfghiîïjkmlmnoôpqrstuûvwxyz0123456789-\xe7\xc7';
const punctuation = '.?!:\n\t';
const charErase =[ '\r', '&nbsp;', '&#160;', '&mdash;', '&quot;', '\x9c', '\xa0' ];
const charReplace =[
	['«', '"'], ['»', '"'], ['–', '-'], ['‘', "'"], ['’', "'"], ['“', '"'], ['”', '"'], ['"', '"'], ['&hellip;', '...'], ['…', '...'], ['\u00c2', 'Â'], ['\u00ca', 'Ê'], ['\u00cb', 'Ë'], ['\u00ce', 'Î'], ['\u00cf', 'Ï'], ['\u00d4', 'Ô'], ['\u00d6', 'Ö'], ['\u00db', 'Û'], ['\u00e0', 'à'], ['\u00e2', 'â'], ['\u00e7', 'ç'], ['\u00e8', 'è'], ['\u00e9', 'é'], ['\u00ea', 'ê'], ['\u00eb', 'ë'], ['\u00ee', 'î'], ['\u00ef', 'ï'], ['\u00f4', 'ô'], ['\u00f6', 'ö'], ['\u00fb', 'û'], ['\x85', '.'], ['\x92', "'"], ['\x96', '"'], ['\x97', "'"], ['&agrave;', 'à'], ['&acirc;', 'â'], ['&ccedil;', 'ç'], ['&eacute;', 'é'], ['&egrave;', 'è'], ['&ecirc;', 'ê'], ['&icirc;', 'î'], ['&iuml;', 'ï'], ['&ocirc;', 'ô'], ['&ugrave;', 'ù'], ['&ucirc;', 'û'], ['&apos;', "'"], ['&ldquo;', '"'], ['&rdquo;', '"'], ['&rsquo;', "'"], ['&#8220;', '"'], ['&#8221;', '"'], ['&amp;', '&'], ['&#x27;', "'"], ['&#039', "'"], ['&#39;', "'"], ['&#8217;', "'"], ['&oelig;', 'oe'], ['&lt;', '<'], ['&gt;', '>']
];
const charUpper =[ 'aA', 'àA', 'bB', 'cC', '\xe7\xc7', 'dD', 'eE', 'éE', 'èE', 'êE', 'ëE', 'fF', 'gG', 'hH', 'iI', 'îI', 'ïI', 'jJ', 'kK', 'lL', 'mM', 'nN', 'oO', '\xf4\xe4', 'pP', 'qQ', 'rR', 'sS', 'tT', 'uU', 'vV', 'wW', 'xX', 'yY', 'zZ'];
const wordsBeginMaj =['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', 'deborah', 'powers', 'maman', 'mamie', 'papa', 'victo', 'tony', 'simplon', 'loïc', 'france', 'paris', 'rueil'];
const wordsBeginMin =['Deborah.powers', 'Deborah.noisetier', 'Http', '\nPg_'];
const urlWords =[ [': /', ':/'], ['localhost: ', 'localhost:'], ['www. ', 'www.'], ['. jpg', '.jpg'], ['. png', '.png'], ['. css', '.css'], ['. js', '.js'], [': 80', ':80'], ['. com', '.com'], ['. org', '.org'], ['. net', '.net'], ['. fr', '.fr'], ['. ico', '.ico'] ]

String.prototype.strip = function(){
	const toStrip = '\n \t/';
	var d=0;
	while (d< this.length && toStrip.includes (this[d])) d++;
	var f= this.length -1;
	while (f>=0 && toStrip.includes (this[f])) f--;
	f=f+1;
	return this.slice (d,f);
}
String.prototype.cleanTxt = function(){
	// éliminer les caractères en trops
	var text = this.replaceAll ('\\', "");
	for (var c=0; c< charErase.length; c++) text = text.replaceAll (charErase[c], " ");
	for (var c=0; c< charReplace.length; c++) text = text.replaceAll (charReplace[c], " ");
	while (text.includes ('....')) text = text.replaceAll ('....', '...');
	while (text.includes ('  ')) text = text.replaceAll ('  ', ' ');
	while (text.includes ('_______')) text = text.replaceAll ('_______', '______');
	while (text.includes ('-------')) text = text.replaceAll ('-------', '------');
	while (text.includes ('=======')) text = text.replaceAll ('=======', '======');
	while (text.includes ('*******')) text = text.replaceAll ('*******', '******');
	text = text.replaceAll (':', ': ');
	for (var u=0; u< urlWords.length; u++) text = text.replaceAll (urlWords[u][0], urlWords[u][1]);
	text = text.replaceAll ('\n ','\n');
	text = text.replaceAll (' \n','\n');
	text = text.replaceAll ('\t ','\t');
	text = text.replaceAll (' \t','\t');
	// nettoyer les bords du texte
	text = text.strip();
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
	const tagHtml =( 'span', 'p', 'div', 'section', 'tr', 'caption', 'table' );
	for (var c=0; c< tagHtml.length; c++) text = text.replaceAll ('<'+ tagHtml[c] +'></'+ tagHtml[c] +'>', "");
	return text;
}
String.prototype.usePlaceholders = function(){
	const placeholders = ('y/n', 'e/c', 'h/c', 'l/n');
	var text = this.cleanTxt();
	for (var p=0; p< placeholders.length; p++){
		text = text.replaceAll (placeholders[p].upper(), placeholders[p]);
		text = text.replaceAll ('('+ placeholders[p] +')', placeholders[p]);
		text = text.replaceAll ('['+ placeholders[p] +']', placeholders[p]);
		text = text.replaceAll ('{'+ placeholders[p] +'}', placeholders[p]);
	}
	text = text.replaceAll ('y/n', 'Deborah');
	text = text.replaceAll ('e/c', 'grey');
	text = text.replaceAll ('h/c', 'dark blond');
	text = text.replaceAll ('l/n', 'Powers');
	return text;
}
