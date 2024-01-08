var Fname = document.getElementById ('f-name');
var Lname = document.getElementById ('l-name');
		var showFname = document.getElementById ('showFname');
		var showLname = document.getElementById ('showLname');
function printName(){
	var txtFname = Fname.value;
	var txtLname = Lname.value;
	showFname.innerHTML = 'Votre prénom est: '+ txtFname;
	showLname.innerHTML = 'Votre nom est: '+ txtLname;
}