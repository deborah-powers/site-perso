function turnStraigth(){
	const room = document.getElementsByTagName ('piece')[0];
	room.style.transform ="";
}
function turnLeft(){
	const room = document.getElementsByTagName ('piece')[0];
	if (! room.style.transform) room.style.transform = 'rotateY(-15deg)';
	else if ('rotateY(-90deg)' === room.style.transform) room.style.transform ="";
	else{
		var degStr = room.style.transform.substring (8, room.style.transform.length -4);
		var degInt = parseInt (degStr);
		degInt -=15;
		degStr = degInt.toString();
		room.style.transform = 'rotateY(' + degStr + 'deg)';
}}
function turnRigth(){
	const room = document.getElementsByTagName ('piece')[0];
	if (! room.style.transform) room.style.transform = 'rotateY(15deg)';
	else if ('rotateY(90deg)' === room.style.transform) room.style.transform ="";
	else{
		var degStr = room.style.transform.substring (8, room.style.transform.length -4);
		var degInt = parseInt (degStr);
		degInt +=15;
		degStr = degInt.toString();
		room.style.transform = 'rotateY(' + degStr + 'deg)';
}}