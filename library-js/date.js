/*
classe facilitant la gestion des dates
*/
var monthDurationList =[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNameList =[ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
class DateSimple{
	constructor(){
		this.day =1;
		this.month =2;
		this.year =1996;
		this.monthDuration =31;
		this.monthName = 'janvier';
		this.setMonth();
	}
	bissextile = function(){
		var isBissextile = false;
		if (this.year %400 ===0) isBissextile = true;
		else if (this.year %100 !==0 && this.year %4 ===0) isBissextile = true;
		if (isBissextile) monthDurationList[1] =29;
		else monthDurationList[1] =28;
	//	return isBissextile;
	}
	setMonth = function (monthNb =0){
		if (monthNb >0) this.month = monthNb;
		this.bissextile();
		this.monthDuration = monthDurationList[this.month -1];
		this.monthName = monthNameList[this.month -1];
	}
	getDate = function(){
		return { day: this.day, month: this.month, year: this.year };
	}
}

Date.prototype.toStringPerso = function(){
//	const year = this.getFullYear();
	const month =1+ this.getMonth();
	const day = this.getDate();
	console.log (month);
//	var dateStr = year +'/';
	var dateStr ="";
	if (month <10) dateStr = '0';
	dateStr = dateStr + month +'/';
	if (day <10) dateStr = dateStr +'0';
	dateStr = dateStr + day;
	return dateStr;
}