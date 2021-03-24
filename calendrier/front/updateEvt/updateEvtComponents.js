angular.module ('events').component ('date', {
	templateUrl: 'front/components/componentDate.html',
	bindings: { date: '=' },
	controller: 'controllerUpdateEvt'
});
angular.module ('events').component ('place', {
	templateUrl: 'front/components/componentPlace.html',
	bindings: { place: '=' },
	controller: 'controllerUpdateEvt'
});
angular.module ('events').component ('contact', {
	templateUrl: 'front/components/componentContact.html',
	bindings: { contact: '=' },
	controller: 'controllerUpdateEvt'
});
angular.module ('events').component ('message', {
	templateUrl: 'front/components/componentMessage.html',
	bindings: { message: '=' },
	controller: 'controllerUpdateEvt'
});