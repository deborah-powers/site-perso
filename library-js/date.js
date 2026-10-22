// classe facilitant la gestion des dates

function comparDate (dateA, dateB){
	if (dateA.year > dateB.year) return 1;
	else if (dateA.year < dateB.year) return -1;
	else if (dateA.month > dateB.month) return 1;
	else if (dateA.month < dateB.month) return -1;
	else if (dateA.day > dateB.day) return 1;
	else if (dateA.day < dateB.day) return -1;
	else return 1;
}
class DatePrint{
	static modelFile = '$yyy-$m-$d';
	static modelLine = '$yyy/$m/$d';

	fromString (modelDate, strDate){
		if (! modelDate.includes ('$yyy')) modelDate = modelDate.replace ('$y', '$yyy');
		this.year = this.fromStringOne (modelDate, strDate, '$yyy', 4);
		this.month = this.fromStringOne (modelDate, strDate, '$m', 2);
		this.day = this.fromStringOne (modelDate, strDate, '$d', 2);
	}
	toString (modelDate){
		if (modelDate === undefined || modelDate === null) modelDate = this.modelLine;
		modelDate = modelDate.replace ('$yyy', this.year);
		modelDate = modelDate.replace ('$y', this.year);
		modelDate = this.toStringOne (modelDate, '$m', this.month);
		modelDate = this.toStringOne (modelDate, '$d', this.day);
		return modelDate;
	}
	toObj(){ return { year: this.year, month: this.month, day: this.day }; }
	fromStringOne (modelDate, strDate, modelOne, lenOne){
		if (modelDate.includes (modelOne)){
			const pos = modelDate.indexOf (modelOne);
			const value = strDate.substring (pos, pos + lenOne);
			return parseInt (value);
	}}
	toStringOne (modelDate, modelOne, nbOne){
		var nbStr = str (nbOne);
		if (nbStr.lenght ===1) nbStr ='0'+ nbStr;
		modelDate = modelDate.replace (modelOne, nbStr);
	}
	compareTo (otherDate){
		if (dateA.year > dateB.year) return 1;
		else if (dateA.year < dateB.year) return -1;
		else if (dateA.month > dateB.month) return 1;
		else if (dateA.month < dateB.month) return -1;
		else if (dateA.day > dateB.day) return 1;
		else if (dateA.day < dateB.day) return -1;
		else return 0;
	}
	constructor (day, month, year){
		this.year =2024;
		this.month =1;
		this.day =1;
		// modelDate et strDate
		if (day !== undefined && day !== null && typeof (day) === 'string' && month !== undefined && month !== null && typeof (month) === 'string')
			this.fromString (day, month);
		else{
			if (year !== undefined && year !== null && typeof (year) === 'number') this.year = year;
			if (month !== undefined && month !== null && typeof (month) === 'number') this.month = month;
			if (day !== undefined && day !== null && typeof (day) === 'number') this.day = day;
		}
	}
}
class DateTime extends DatePrint {
	static modelFile = '$yyy-$m-$d-$h-$M-$s';
	static modelLine = '$yyy/$m/$d $h:$M:$s';

	fromString (modelDate, strDate){
		super.fromString (modelDate, strDate);
		this.hour = this.fromStringOne (modelDate, strDate, '$h', 2);
		this.minute = this.fromStringOne (modelDate, strDate, '$M', 2);
		this.second = this.fromStringOne (modelDate, strDate, '$s', 2);
	}
	toString (modelDate){
		modelDate = super.toString (modelDate);
		modelDate = this.toStringOne (modelDate, '$h', this.hour);
		modelDate = this.toStringOne (modelDate, '$M', this.minute);
		modelDate = this.toStringOne (modelDate, '$s', this.second);
		return modelDate;
	}
	toObj(){ return { year: this.year, month: this.month, day: this.day, hour: this.hour, minute: this.minute, second: this.second }; }
	compareTo (otherDate){
		var score = super.compareTo (otherDate);
		if (score !==0) return score;
		else if (dateA.hour > dateB.hour) return 1;
		else if (dateA.hour < dateB.hour) return -1;
		else if (dateA.minute > dateB.minute) return 1;
		else if (dateA.minute < dateB.minute) return -1;
		else if (dateA.second > dateB.second) return 1;
		else if (dateA.second < dateB.second) return -1;
		else return 1;
	}
	constructor (day, month, hour, minute, year, second){
		super (day, month, year);
		this.hour =0;
		this.minute =0;
		this.second =0;
		if (hour !== undefined && hour !== null && typeof (hour) === 'number') this.hour = hour;
		if (minute !== undefined && minute !== null && typeof (minute) === 'number') this.minute = minute;
		if (second !== undefined && second !== null && typeof (second) === 'number') this.second = second;
	}
}
const monthNameList =[ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ];
const dayWeekList =[ 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche' ];

function bissextile (year){
	var isBissextile = false;
	if (year %400 ===0) isBissextile = true;
	else if (year %100 !==0 && year %4 ===0) isBissextile = true;
	return isBissextile;
}
class DateCalcul extends DatePrint{
	constructor (day, month, year){
		super (day, month, year);
		this.monthDurationList =[ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		this.bissextile();
	}
	fromString (modelDate, strDate){
		super.fromString (modelDate, strDate);
		this.bissextile();
	}
	bissextile(){
		this.monthDurationList =[ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		const isBissextile = bissextile (this.year);
		if (isBissextile) this.monthDurationList[1] =29;
	}
	nbDaysSinceYearStart(){
		var nbDays = this.day;
		var m= this.month -2;
		for (; m>-1; m--) nbDays += this.monthDurationList[m];
		return nbDays;
	}
	nbDaysSinceRef(){
		var nbDays = this.nbDaysSinceYearStart();
		for (var y=2000; y< this.year; y++){
			nbDays +=365;
			if (bissextile (y)) nbDays +=1;
		}
		return nbDays;
	}
}
class DateWord extends DateCalcul{
	static modelTitle = '$wd $d $m $yyy';

	fromString (modelDate, strDate){
		super.fromString (modelDate, strDate);
		this.setWords();
	}
	toString (modelDate){
		if (modelDate === undefined || modelDate === null) modelDate = this.modelTitle;
		modelDate = super.toString (modelDate);
		modelDate = modelDate.replace ('$wd', this.dayWeek);
		return modelDate;
	}
	constructor (day, month, year){
		super (day, month, year);
		this.monthName ="";
		this.dayWeek ="";
		this.setWords();
	}
	setWords(){
		const isBissextile = bissextile (this.year);
		this.monthDurationList =[ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (isBissextile) this.monthDurationList[1] =29;
		this.monthName = monthNameList [this.month -1];
		// le 1 janvier 2000 était un samedi
		var dayWeek =5;
		var nbDays = this.nbDaysSinceRef();
		nbDays = nbDays %7;
		nbDays += dayWeek;
		if (nbDays >7) nbDays -=7;
		this.dayWeek = dayWeekList [nbDays];
	}
}
// objets intéresants que je n'utilise pas pour le momment
class Month{
	static janvier = new Month ('01', 'janvier', 31);
	static fevrier = new Month ('02', 'fevrier', 28);
	static mars = new Month ('03', 'mars', 31);
	static avril = new Month ('04', 'avril', 30);
	static mai = new Month ('05', 'mai', 31);
	static juin = new Month ('06', 'juin', 30);
	static juillet = new Month ('07', 'juillet', 31);
	static aout = new Month ('08', 'août', 31);
	static septembre = new Month ('09', 'septembre', 30);
	static octobre = new Month ('10', 'octobre', 31);
	static novembre = new Month ('11', 'novembre', 30);
	static decembre = new Month ('12', 'décembre', 31);

	static fromNum (numero){
		if (numero === '01' || numero ===1) return this.janvier;
		else if (numero === '02' || numero ===2) return this.fevrier;
		else if (numero === '03' || numero ===3) return this.mars;
		else if (numero === '04' || numero ===4) return this.avril;
		else if (numero === '05' || numero ===5) return this.mai;
		else if (numero === '06' || numero ===6) return this.juin;
		else if (numero === '07' || numero ===7) return this.juillet;
		else if (numero === '08' || numero ===8) return this.aout;
		else if (numero === '09' || numero ===9) return this.septembre;
		else if (numero === '10' || numero ===10) return this.octobre;
		else if (numero === '11' || numero ===11) return this.novembre;
		else if (numero === '12' || numero ===12) return this.decembre;
	}
	constructor (numero, name, duration){
		this.name = name;
		this.duration = duration;
		this.numero = numero;
		this.bissextile();
	}
	bissextile = function(){
		var isBissextile = false;
		if (this.year %400 ===0) isBissextile = true;
		else if (this.year %100 !==0 && this.year %4 ===0) isBissextile = true;
		if (isBissextile && this.numero === '02') this.duration =29;
	}
}
Date.prototype.toStringPerso = function(){
//	const year = this.getFullYear();
	const month =1+ this.getMonth();
	const day = this.getDate();
//	var dateStr = year +'/';
	var dateStr ="";
	if (month <10) dateStr = '0';
	dateStr = dateStr + month +'/';
	if (day <10) dateStr = dateStr +'0';
	dateStr = dateStr + day;
	return dateStr;
}