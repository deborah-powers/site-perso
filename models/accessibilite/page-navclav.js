// gérer la navigation via le clavier, avec les touches tab, 
const sectionNavClavier = document.getElementById ('navigation-clavier');

sectionNavClavier.addEventListener ('keyup', function (event){
	// changer le focus en appuyant sur les fleches haut et bas
	console.log (event.key, event.target.tagName);
	if (event.key === 'ArrowUp'){
		if (event.target.previousElementSibling === null || event.target.previousElementSibling.tagName === 'H2'){
			if (event.target.tagName === 'P') event.target.parentElement.focus();
			else event.target.parentElement.lastElementChild.focus();
		}
		else event.target.previousElementSibling.focus();
	//	document.activeElement = event.target.previousElementSibling;
	}
	else if (event.key === 'ArrowDown'){
		if (event.target.nextElementSibling === null){
			if (event.target.tagName === 'P') event.target.parentElement.focus();
			else event.target.parentElement.children[1].focus();
		}
		else event.target.nextElementSibling.focus();
	}
	else if (event.key === 'Shift' || event.key === 'Enter'){
		if (event.target.tagName === 'DIV') event.target.children[0].focus();
		else if (event.target.tagName === 'P') event.target.parentElement.focus();
	}
});
/* autres évenements
parent.addEventListener ('keydown',  function (event){ console.log ('down', event);	 });
parent.addEventListener ('keypress', function (event){ console.log ('press', event); });
parent.addEventListener ('keyup',	 function (event){ console.log ('up', event);	 });
child.addEventListener  ('focus',	 function (event){ console.log ('focus', event); });
*/