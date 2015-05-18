define(['app'], function(app){

	app.controller('pageCtrll', ['$scope', '$rootScope', 'datService', '$routeParams', function($scope, $rootScope, datService, $routeParams){

		datService.getPage($routeParams.slug).then(function(pagina){
			$scope.pagina = pagina;

			datService.getImage($scope.pagina.parentId, $scope.pagina.$id).then(function(image){
				$scope.pagina.image = image.data;
			});
		});
		
    }]);

    return app;
});