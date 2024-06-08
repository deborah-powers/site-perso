angular.module ('cssApp', ['ui.router']);
// le routage
angular.module ('cssApp').config (function ($stateProvider, $urlRouterProvider, $locationProvider){
	$stateProvider.state ({ name: 'back', url: '/fond', templateUrl: 'page-back.html' });
	$stateProvider.state ({ name: 'grid', url: '/grid', templateUrl: 'page-grid.html' });
	$stateProvider.state ({ name: 'list', url: '/liste', templateUrl: 'page-list.html' });
	$stateProvider.state ({ name: 'math', url: '/math-ml', templateUrl: 'page-math.html' });
	$stateProvider.state ({ name: 'bord', url: '/bordure', templateUrl: 'page-bord.html' });
	$stateProvider.state ({ name: 'flex', url: '/flex-box', templateUrl: 'page-flex.html' });
	$stateProvider.state ({ name: 'anim', url: '/animation', templateUrl: 'page-anim.html' });
	$stateProvider.state ({ name: 'form', url: '/formulaire', templateUrl: 'page-form.html' });
	$stateProvider.state ({ name: 'shape', url: '/forme', templateUrl: 'page-shape.html' });
	$stateProvider.state ({ name: 'table', url: '/tableau', templateUrl: 'page-table.html' });
	$stateProvider.state ({ name: 'space', url: '/espacement', templateUrl: 'page-space.html' });
	$stateProvider.state ({ name: 'query', url: '/media-query', templateUrl: 'page-query.html' });
	$stateProvider.state ({ name: 'image', url: '/image-et-lien', templateUrl: 'page-image.html' });
	$stateProvider.state ({ name: 'position', url: '/position', templateUrl: 'page-position.html' });
	$stateProvider.state ({ name: 'gnrl', url: '/generalites', templateUrl: 'page-general.html' });
	$urlRouterProvider.otherwise ('/generalites');
	$locationProvider.hashPrefix ('');
//	$locationProvider.html5Mode (true);
});