define(['app'], function(app){

	app.controller('pageListCtrll', ['$scope', '$rootScope', 'datService', '$routeParams', function($scope, $rootScope, datService, $routeParams){

		datService.getPages($routeParams.slug).then(function(data){
			$scope.paginas = data.paginas;
			$scope.categoria = data.categoria;

			datService.getImages(data.categoria.$id).then(function(images){
				angular.forEach($scope.paginas, function(value, key) {
					if(images[value.$id]){
						value.image = images[value.$id].data;
					}
		        });
			});
		});
		
    }]);

    return app;
});