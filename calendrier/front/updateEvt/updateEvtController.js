angular.module ('events').controller ('controllerUpdateEvt', function ($scope, $http, dateService, eventService){
	// recuperer les evenements
	$scope.listEvt =[];
	$scope.toUpdate ={};
	var toUpdateId =0;
	$scope.todayDate = dateService.todayDate;
	$scope.blankDate = dateService.blankDate;
	// option prédéfinies
	$scope.place ={};
	$scope.contact ={};
	$scope.message ={};
	$scope.message.priority = 'low';
	$scope.date = dateService.newDate();
	$scope.date.recurrence = 'no';
	// id correspond a l'id de l'objet dans $scope.listEvt
	$scope.selectEvt = function (id){
		toUpdateId = id;
		$scope.toUpdate = $scope.listEvt[id];
		eventService.toForm ($scope.toUpdate, $scope.date, $scope.place, $scope.contact, $scope.message);
	}
	// recuperer les infos de la page php via un get
	const pagePhpGetEvt = 'http://localhost/calendrier/back/actions/showEvt.php';
	$http.get (pagePhpGetEvt).then (function (response){
		console.log ('response:', response.data);
		$scope.listEvt = response.data;
		$scope.selectEvt (0);
	});
	$scope.updateEvt = function(){
		// enregistrer les modifications
		var evtOriginal = eventService.copyEvt ($scope.toUpdate);
		eventService.fromForm ($scope.toUpdate, $scope.date, $scope.place, $scope.contact, $scope.message);
		const pagePhpUpdEvt = 'http://localhost/calendrier/back/actions/updateEvt.php';
		var events =[ evtOriginal, $scope.toUpdate ];
		$http.post (pagePhpUpdEvt, events).then (function (response){
			console.log ('response:', response.data);
			window.location = 'index.html';
		});
	}

});