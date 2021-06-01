
class TestFunc extends Text{
	constructor (func, res, ...args){
		super();
		this.okMessage = 'la fonction marche comme attendue';
		this.koMessage = 'la fonction donne un résultat innatendu';
		this.function = func;
		this.resPredicted = res;
		this.arguments = args;
		this.resComputed =null;
	}
	launch = function(){
		if (! this.arguments) this.resComputed = this.function();
		else this.resComputed = this.function.apply (null, this.arguments);
		if (this.resComputed === this.resPredicted) console.log (this.okMessage);
		else console.log (this.koMessage);
	}
	toText = function(){
		this.text = 'fonction: '+ this.function.name + ', résultat attendu: '+ this.resPredicted;
		if (this.arguments) this.text = this.text + ', arguments: '+ this.arguments;
		if (this.resComputed){
			this.text = this.text + ', résultat obtenu: '+ this.resComputed;
			if (this.resComputed === this.resPredicted) this.text = this.text + '. '+ this.okMessage;
			else this.text = this.text + '. '+ this.koMessage;
		}
	}
	logFunc = function (message){
		this.toText();
		console.log ('prototype', Text.prototype);
		console.log ('__proto__', Object.getPrototypeOf(Object.getPrototypeOf(this)));
		Text.prototype.log.call (this);
		this.log (message);
	}
	printFunc = function (objDest){
		this.toText();
		this.replace (', ', ',\n');
		this.replace ('. ', ',\n');
		this.print (objDest);
	}
}
function testFunc (prenom1, prenom2){
	console.log ('coucou', prenom1, 'et', prenom2);
	return 1;
}
var tst = new TestFunc (testFunc, 2, 'David', 'Laura');
tst.launch();
tst.logFunc();
