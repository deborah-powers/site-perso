const params = itemFromUrl();
var today = new Date();
var depenseList =[{ date: '2023-02-14', montant: '12.4', lieu: 'paris', categorie: 'sortie', commentaire: 'ras' }];

function trierDepenses (depenseA, depenseB){
	if (depenseA.date < depenseB.date) return -1;
	else if (depenseA.date > depenseB.date) return 1;
	else if (depenseA.lieu < depenseB.lieu) return -1;
	else if (depenseA.lieu > depenseB.lieu) return 1;
	else if (depenseA.categorie < depenseB.categorie) return -1;
	else if (depenseA.categorie > depenseB.categorie) return 1;
	else if (depenseA.montant < depenseB.montant) return -1;
	else if (depenseA.montant > depenseB.montant) return 1;
	else if (depenseA.commentaire < depenseB.commentaire) return -1;
	else if (depenseA.commentaire > depenseB.commentaire) return 1;
	else return 1;
}
function getFromOdb (dateString){
	// récupère une liste d'objets
	if (window.navigator.onLine){
		var pathGet = pathApp + 'get.php?date=';
		if (exists (dateString) && 'day week'.includes (dateString)) pathGet = pathGet + dateString;
		else pathGet = pathGet + 'all'
		var xhttp = new XMLHttpRequest();
		xhttp.open ('GET', pathGet, false);
		xhttp.send();
		if (xhttp.status ==0 || xhttp.status ==200){
			var depenseList = JSON.parse (xhttp.responseText);
			for (var i=0; i< depenseList.length; i++){
				depenseList[i]['etat'] = 'old';
				depenseList[i].id = parseInt (depenseList[i].id);
			}
			depenseList.sort (trierDepenses);
			return depenseList;
		} else return [];
	} else return [];
}
function fromOdbToIdb (depenseList){
	// item ={ id: 0, etat: 'new (del, upd, get)', autresChamps }
	const request = window.indexedDB.open (idbBase, 3);
	request.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
	request.onsuccess = function (event){
		console.log (event.target);
		const store = event.target.result.transaction ([idbStore], 'readwrite').objectStore (idbStore);
		for (var i=0; i< depenseList.length; i++){
			const itemId = depenseList[i].id;
			const request = store.add (depenseList[i]);
			request.onerror = function(){ console.log ("l'insertion de l'objet a échouée", depenseList[i].id); };
			request.onsuccess = function(){ console.log ("l'insertion de l'objet a réussi", depenseList[i].id); };
	}};
}
function getFromIdb (dateString){
	if (window.indexedDB){
		const request = window.indexedDB.open (idbBase, 3);
		request.onerror = function (event){
			depenseList = getFromOdb (dateString);
			document.body.innerHTML = bodyTemplate;
			dpLoad();
		};
		request.onsuccess = function (event){
			const store = event.target.result.transaction ([idbStore], 'readonly').objectStore (idbStore);
			store.onsuccess = function (event){ console.log ("la récupération de la liste objets à réussi"); };
			store.onerror = function (event){ console.log ("la récupération de la liste objets à échouée"); };
			store.openCursor().onsuccess = function (event){
				var cursor = event.target.result;
				if (cursor){
					if (exists (dateString) && cursor.value.date >= dateString) depenseList.push (cursor.value);
					else if (! exists (dateString)) depenseList.push (cursor.value);
					cursor.continue();
				}else{
					if (depenseList.length ===0){
						depenseList = getFromOdb (dateString);
						fromOdbToIdb (depenseList);
					}
					else{
						depenseList.sort (trierDepenses);
						document.body.innerHTML = bodyTemplate;
						dpLoad();
		}}};};
		request.onupgradeneeded = function (event){
			const database = event.target.result;
			database.onerror = function(){ console.log ('erreur de chargement de la base de donnée locale'); };
			const objectStore = database.createObjectStore (idbStore, { keyPath: 'id' });
	}}
	else{
		depenseList = getFromOdb (databaseName);
		document.body.innerHTML = bodyTemplate;
		dpLoad();
}}
var periodeMessage ="";
if (params.type === 'day'){
	periodeMessage = 'du jour';
	getFromIdb (today.toStringPerso());
}
else if (params.type === 'week'){
	periodeMessage = 'de la semaine';
	today.setDate (today.getDate() -7);
	getFromIdb (today.toStringPerso());
}
else getFromIdb();
dpInit();