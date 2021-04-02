const letters = '0369CF';
var sideId = document.getElementsByTagName ('div')[0].id;

function selSide (div){ sideId = div.id; }

document.body.init();

debbyPlay.colorCodes =[];
var txt, clazz, score;

for (var l=0; l< letters.length; l++){
	debbyPlay.colorCodes.push ([]);
	for (var m=0; m< letters.length; m++){
		for (var n=0; n< letters.length; n++){
			txt ='#'+ letters[l] + letters[m] + letters[n];
			debbyPlay.colorCodes[l].push (txt);
}}}

debbyPlay.colorNames =[
'black', 'grey', 'silver', 'white', 'cyan', 'teal', 'blue', 'navy', 'purple', 'magenta', 'red', 'maroon', 'olive', 'yellow', 'lime', 'green',
'aqua', 'aquamarine', 'turquoise', 'lightseagreen', 'darkcyan', 'darkblue', 'darkmagenta', 'deeppink', 'plum', 'violet', 'lightpink', 'pink', 'lightgrey', 'darkgrey', 'grey', 'gray', 'lightblue', 'cadetblue', 'darkseagreen', 'seagreen', 'lightgreen', 'darkgreen', 'gold', 'orange', 'darkorange', 'orangered', 'darkred', 'brown', 'sienna', 'chocolate', 'lightcoral', 'salmon', 'coral'
];

debbyPlay.colorB = debbyPlay.colorCodes[2][3];
debbyPlay.colorA = debbyPlay.colorCodes[3][1];

function selColor (col){
	debbyPlay.colorA = col.innerText;
	debbyPlay.colorB = col.innerText;
	document.getElementById (sideId).load();
}
function testColor(){
	debbyPlay.colorA = document.getElementsByTagName ('input')[0].value;
	document.getElementsByTagName ('div')[0].load();
}
document.body.load();