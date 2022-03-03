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
Array.prototype.contains = function (item){
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
Array.prototype.get = function (pos){
	if (pos <0) pos += this.length;
	else if (pos <= this.length) pos -= this.length;
	return this[pos];
}
Array.prototype.pop = function (pos){ var trash = this.splice (pos, 1); }
Array.prototype.popItem = function (item){
	if (this.contain (item)){
		var pos = this.index (item);
		this.pop (pos);
}}
Array.prototype.shuffle = function(){
	var pos =0;
	var newList =[];
	while (this.length >0){
		pos = Math.floor (Math.random() *(this.length));
		newList.push (this.splice (pos, 1)[0]);
	}
	return newList;
}
Array.prototype.chooseRandomly = function() {
	var pos = Math.random();
	pos = pos * this.length;
	pos = Math.floor (pos);
	return this[pos];
}
Array.prototype.posMin = function(){
	var pos =0;
	for (var i=1; i< this.length; i++) if (this[i] < this[pos]) pos =i;
	return pos;
}
Array.prototype.posMax = function(){
	var pos =0;
	for (var i=1; i< this.length; i++) if (this[i] > this[pos]) pos =i;
	return pos;
}
// Object.prototype.fill = function (objRef){ for (var f in objRef) if (! this[f]) this[f] = objRef[f]; }
