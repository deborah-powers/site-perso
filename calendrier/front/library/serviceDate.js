// source: https://www.w3schools.com/jsref/jsref_obj_date.asp
angular.module ('events').service ('dateService', function(){
	function newDate(){
		return {
			year: 2018,
			month: 1,
			day: 1,
			hour: 0,
			minute: 0,
		};
	}
	// choisir la date du jour
	function todayDate (date){
		var today = new Date();
		date.year = today.getFullYear();
		date.month = today.getMonth() +1;
		date.day = today.getDate();
		date.hour = today.getHours();
		date.minute = today.getMinutes();
	}
	// choisir la date par defaut, "blank", 0000/00/00, 00:00
	function blankDate (date){
		date.year =2018;
		date.month =1;
		date.day =1;
		date.hour =0;
		date.minute =0;
	}
	// extraire la date d'un objet
	function fromObj (obj){
		var date = newDate();
		if (obj.year) date.year = obj.year;
		if (obj.month) date.month = obj.month;
		if (obj.day) date.day = obj.day;
		if (obj.hour) date.hour = obj.hour;
		if (obj.minute) date.minute = obj.minute;
		return date;
	}
	// les annees bissextiles. la premiere case represente decembre, le mois avant janvier
	const daysInMonth =[31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	function isBissextile (year){
		var bissextile = false;
		if (year %4 ==0){
			bissextile = true;
			if (year %100 ==0){
				bissextile = false;
				if (year %400 ==0) bissextile = true;
			}
		}
		return bissextile;
	}
	// modifier la date
	function addMonth (date){
		date.month +=1;
		if (date.month >12){
			date.month =1;
			date.year +=1;
			}
		}
	function addDay (date){
		date.day +=1;
		if ((date.month ==2) && (date.bissextile) && (date.day >29)){
			date.day =1;
			addMonth (date);
			}
		else if (date.day > daysInMonth [date.month]){
			date.day =1;
			addMonth (date);
			}
		}
	function addWeek (date){
		for (d=0; d<7; d++){ addDay (date); }
	}
	// comparer deux dates
	function comparDates (date1, date2){
		/* verifier si date1 > date2
			1: date1 > date2
			0: date1 = date2
			-1: date1 < date2
		*/
		var isSup =-1;
		if (date1.year > date2.year) isSup =1;
		else if (date1.year == date2.year){
			if (date1.month > date2.month) isSup =1;
			else if (date1.month == date2.month){
				if (date1.day > date2.day) isSup =1;
				else if (date1.day == date2.day){
					if (date1.hour > date2.hour) isSup =1;
					else if (date1.hour == date2.hour){
						if (date1.minute > date2.minute) isSup =1;
						else if (date1.minute == date2.minute) isSup =0;
					}
				}
			}
		}
		return isSup;
	}
	return {
		newDate,
		todayDate,
		blankDate,
		fromObj,
		addMonth,
		addDay,
		addWeek,
		comparDates
	}
});
angular.module ('events').filter ('decade', function(){
	// ecrire les nombres sur deux chiffres, 03 au lieu de 3
	return function (number){
		var numberWithDozen = number.toString();
		if (numberWithDozen.length ===1) numberWithDozen ='0'+ numberWithDozen;
		return numberWithDozen;
	}
});