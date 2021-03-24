angular.module ('events').controller ('controllerShowEvt', function ($scope, $http, $location, dateService){
	// recuperer les evenements
	var listEvt =[];
	$scope.listEvt =[];
	$scope.listTags =[];


	// recuperer les infos de la page php via un get
	const pagePhpGetEvt = 'http://localhost/calendrier/back/actions/showEvt.php';
	$http.get (pagePhpGetEvt).then (function (response){
		console.log ('events list:', response.data);
		// tous les evenements
		listEvt = response.data;
		$scope.listEvt = response.data;
		// les tags
		listEvt.forEach (function (evt){
			listTags = evt.tags.split (', ');
			listTags.forEach (function (tag){
				if ($scope.listTags.indexOf (tag) <0) $scope.listTags.push (tag);
			});
		});
		$scope.listTags.push ('Tous');
	});
	// tags selectionnes
	$scope.tag = 'Tous';
	$scope.chooseTag = function(){
		if ($scope.tag === 'Tous'){
			$scope.listEvt =[];
			$scope.listEvt = listEvt;
		}
		else{
			listEvt.forEach (function (evt){
				if (evt.tags.indexOf ($scope.tag) >=0) $scope.listEvt.push (evt);
			});
		}
	}

	// date du jour
	var today = dateService.newDate();
	dateService.todayDate (today);
	// reperer les evenements du mois
	function findMonthEvt (evt){
		return (evt.year == today.year) && (evt.month == today.month);
	}
	$scope.showMonthEvt = function(){
		$scope.listEvt =[];
		$scope.listEvt = listEvt.filter (findMonthEvt);
	}
	// reperer les evenements de la semaine
	var nextWeek = dateService.newDate();
	dateService.todayDate (nextWeek);
	dateService.addWeek (nextWeek);
	function findWeekEvt (evt){
		var res = false;
		if (evt.priority !== 'old'){
			evtDate = dateService.fromObj (evt);
			var comparToday = dateService.comparDates (evtDate, today);
			var comparNextWeek = dateService.comparDates (evtDate, nextWeek);
			if ((comparToday >=0) && (comparNextWeek ==-1)) res = true;
		}
		return res;
	}
	$scope.showWeekEvt = function(){
		$scope.listEvt =[];
		$scope.listEvt = listEvt.filter (findWeekEvt);
	}
	// reperer les evenements du jour
	function findDayEvt (evt){
		return (evt.year == today.year) && (evt.month == today.month) && (evt.day == today.day);
	}
	$scope.showDayEvt = function(){
		$scope.listEvt =[];
		$scope.listEvt = listEvt.filter (findDayEvt);
	}
	// recuperer tous les evenements
	$scope.showAllEvt = function(){
		$scope.listEvt =[];
		$scope.listEvt = listEvt;
	}

	// supprimer un evt
	$scope.deleteEvt = function (id){
		// A) supprimer l'element des listes js
		// id correspond a l'id de l'objet dans $scope.listEvt
		// retrouver l'objet a supprimer
		var toDelete = $scope.listEvt[id];
		$scope.listEvt.splice (id, 1);
		// retrouver son id dans la liste originale
		id = listEvt.indexOf (toDelete);
		listEvt.splice (id, 1);
		// B) supprimer l'element de la bdd
		const pagePhpDelEvt = 'http://localhost/calendrier/back/actions/deleteEvt.php';
		$http.post (pagePhpDelEvt, toDelete).then (function (response){
			console.log ('reponse du delete:', response.data);
		});
	}

	// enregister les evenements dans un json
	$scope.writeEvt = function(){
		// recuperer le chemin du dossier actuel
		var url = $location.absUrl();
		var endPath = url.lastIndexOf ('/') +1;
		url = url.slice (0, endPath);
		// envoyer les donnees au back
		var urlAndData =[ url, $scope.listEvt ];
		const pagePhpWriteEvt = 'http://localhost/calendrier/back/actions/writeEvt.php';
		$http.post (pagePhpWriteEvt, urlAndData).then (function (response){
			console.log ("reponse de l'ecriture:", response.data);
		});
	}
});