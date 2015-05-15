define(['app'], function(app){

	app.controller('pageListCtrll', ['$scope', '$rootScope', 'datService', '$routeParams', function($scope, $rootScope, datService, $routeParams){

		datService.getPages($routeParams.slug).then(function(data){
			$scope.paginas = data.paginas;
			$scope.categoria = data.categoria;
		});
		
    }]);

    return app;
});