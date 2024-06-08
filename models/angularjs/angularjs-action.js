angular.module ('bookApp').controller ('myCtl', function ($scope){ $scope.title = 'application angular-js'; });
angular.module ('bookApp').service ('bookList', function(){
	var listBooks =[{
		name: 'The Magic Of Thinking Big',
		author: 'David Schwartz',
		price: '10',
		currency: '$',
	}, {
		name: 'The Pillars of the Earth',
		author: 'Ken Follet',
		price: '20',
		currency: '$',
	}, {
		name: 'Zero To One',
		author: 'Peter Thiel',
		price: '15',
		currency: '$',
	}];
	return listBooks;
});
