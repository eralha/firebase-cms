define(['app'], function(app){

	app.controller('pageCtrll', ['$scope', '$rootScope', 'datService', '$routeParams', function($scope, $rootScope, datService, $routeParams){

		datService.getPage($routeParams.slug).then(function(pagina){
			$scope.pagina = pagina;
		});
		
    }]);

    return app;
});