// fonctions à rajouter au type Array

Array.prototype.copy = function(){
	var newList =[];
	for (var l=0; l< this.length; l++) newList.push (this[l]);
	return newList;
}
Array.prototype.index = function (item, pos){
	if (! pos) pos =0;
	return this.indexOf (item, pos);
}
Array.prototype.rindex = function (item){
	return this.lastIndexOf (item);
}
Array.prototype.contain = function (item){
	if (this.index (item) >=0) return true;
	else return false;
}
Array.prototype.count = function (item) {
	if (! this.contain (item)) return 0;
	var pos =-1, nb=-1;
	while (pos >=0){
		pos +=1; nb +=1;
		pos = this.index (item, pos);
	}
	return nb;
}
// pas besoin de fonction split, et join existe déjà
Array.prototype.slice = function (start, end){
	if (! end) end = this.length;
	else if (end <0) end = this.length + end;
	var newList =[];
	while (start <= end){
		newList.push (this[start]);
		start = start +1;
	}
	return newList;
}
Array.prototype.pop = function (pos){ var trash = this.splice (pos, 1); }
Array.prototype.shuffle = function(){
	var pos =0;
	var newList =[];
	while (this.length >0){
		pos = Math.floor (Math.random() *(this.length));
		console.log (pos);
		newList.push (this.splice (pos, 1)[0]);
	}
	return newList;
}
// Object.prototype.fill = function (objRef){ for (var f in objRef) if (! this[f]) this[f] = objRef[f]; }
