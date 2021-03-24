angular.module ('events').controller ('controllerCreateEvt', function ($scope, $http, dateService, eventService){
	// la date
	$scope.todayDate = dateService.todayDate;
	$scope.blankDate = dateService.blankDate;
	// option prédéfinies
	$scope.place ={};
	$scope.contact ={};
	$scope.message ={};
	$scope.message.priority = 'low';
	$scope.date = dateService.newDate();
	$scope.date.recurrence = 'no';
	$scope.todayDate ($scope.date);
	// enregistrer le message
	$scope.createEvt = function(){
		// creer un objet json contenant les champs de la bdd
		var event = eventService.createEvt();
		eventService.fromForm (event, $scope.date, $scope.place, $scope.contact, $scope.message);
		const pagePhp = 'http://localhost/calendrier/back/actions/createEvt.php';
		$http.post (pagePhp, event).then (function (response){
			console.log ('response:', response.data);
			window.location = 'index.html';
		});
	}
});