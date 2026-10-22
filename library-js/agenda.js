const agendaStyle = `agenda {
	display: flex;
	flex-direction: column;
	margin-left: 0;
}
ul.agenda > li {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-style: solid;
	border-radius: 1em;
	padding: 1em;
}
ul.agenda > li.locataires { background-color: lightblue; }
`;
const eventTemplate = `<li class=''>
	<h3>$jour $heure - $titre</h3>
	<p>$description</p>
	<p>$lieu</p>
	<p>$locatairesImpliques invités</p>
</li>`;
// récupérer l'agenda affiché sur la page
const agendaTag = document.getElementsByClassName ('agenda')[0];
if (agendaTag !== undefined){
	console.log (agendaTag);
	if (typeof (agenda) === 'undefined') agendaTag.innerHTML = "<li>pas d'évênement à venir</li>";
	else{
		// créer les évênements
		for (var event of agenda){
			var eventTag = eventTemplate.replace ('$jour', event.jour);
			eventTag = eventTag.replace ('$heure', event.heure);
			eventTag = eventTag.replace ('$titre', event.titre);
			eventTag = eventTag.replace ('$lieu', event.lieu);
			eventTag = eventTag.replace ('$description', event.description);
			if (event.locataires_impliques){
				eventTag = eventTag.replace ('$locatairesImpliques', 'locataires');
				eventTag = eventTag.replace ("class=''", "class='locataires'");
			}
			else eventTag = eventTag.replace ('$locatairesImpliques', 'syndic');
			agendaTag.innerHTML = agendaTag.innerHTML + eventTag;
		}
		// ajouter le style de l'agenda
		var style = document.getElementsByTagName ('style')[0];
		if (style === undefined){
			style = document.createElement ('style');
			style.type = 'text/css';
			document.head.appendChild (style);
		}
		style.innerHTML = style.innerHTML + agendaStyle;
}}