/*
classe facilitant la manipulation des fichiers.
contient la classe File.

var fileObj = new File (string path, ? destId);
	path: nom du fichier
	destId string: id d'une balise où afficher le contenu du fichier
	destId function: fonction de traitement du contenu du fichier

les constantes
	sep le séparateur, dépend de l'ordinateur
	extenstions la liste des extensions de fichiers reconnus par mon script
	pathShortcut le dictionnaires des raccourcis pour écrire un nom de fichier
	pathXx les noms des dossiers les plus importants

dépendences: text.js
*/
class File{
	constructor (fileName, destId =null){
		if (! isFile (fileName)){
			this.error ("le texte n'est pas un fichier", fileName);
			return;
		}
		this.text ="";
		this.ext ="";
		this.title ="";
		this.path ="";
		this.dest = document.body;
		this.id = 'body';
		this.funcRes = function (fileObj){
			document.title = fileObj.title;
			if (! fileObj.dest){
				fileObj.id = 'body';
				fileObj.dest = document.body;
			}
			fileObj.toPage();
		}
		if (destId && ofType (destId, 'function')) this.funcRes = destId;
		else if (destId && ofType (destId, 'string')){
			this.id = destId;
			this.dest = document.getElementById (destId);
		}
		var fileList = fileName.split ('.');
		this.ext = fileList.pop();
		fileName = fileList.join ('.');
		// les raccourcis
		const deb = fileName.slice (0,2);
		fileList = fileName.split (sep);
		this.title = fileList.pop();
		this.path = fileList.join (sep);
		if (this.path) this.path = this.path + sep;
		this.open();
	}
	fileName = function(){ return this.path + this.title +'.'+ this.ext; }
	log = function(){ console.log ('fichier:\n' + this.fileName()); }
	error = function (message, fileName){
		document.title = 'erreur de chargement';
		this.title = message +':\n\t'+ fileName;
		this.text ="";
		console.log (this.title);
		var pError = document.getElementById ('error');
		if (! pError){
			pError = createElement ('p', this.title, this.dest, null, 'error');
			pError.style.textAlign = 'center';
		}
		else pError.innerHTML = this.title;
		return;
	}
	open = function (){
		var fileName = this.fileName();
		var xhttp = new XMLHttpRequest();
		var fileObj = this;
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4){
				fileObj.text = this.responseText;
				fileObj.clean();
				fileObj.log();
				var nbChar = fileObj.text.length;
				if (nbChar){
					fileObj.strip()
					console.log ('le fichier est ouvert et compte '+ fileObj.text.length +' caractÃ¨res');
					fileObj.funcRes (fileObj);
				}
				else fileObj.error ("le fichier n'existe pas", fileName);
			}
		};
		xhttp.open ('GET', fileName, true);
		xhttp.send();
	}
	toPage = function(){
		this.toHtml();
		this.dest.innerHTML = this.text;
		this.dest.style.height ='100%';
	}
}