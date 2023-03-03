const params = itemFromUrl();
console.log (params);

function getFromIdb (dateString){
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
