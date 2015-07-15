define(['app'], function(app){

	app.controller('paginasCtrll', ['$scope', '$firebaseArray', 'Slug', 'configService', function($scope, $firebaseArray, Slug, configService){

		$scope.state = 'available';

		configService.load().then(function(appConfig){
            var paginasRef = new Firebase(appConfig.paginasRef);
            	$scope.paginas = $firebaseArray(paginasRef);
        });

			/*
			paginasRef.orderByChild("state").equalTo('available').on("value", function(snapshot) {
			  $scope.paginas = snapshot.val();
			  $scope.$apply();
			});
			*/

			$scope.sendToTrash = function(page){
				page.state = 'trashed';
				$scope.paginas.$save(page).then(function(ref) {});
			}

			$scope.filterPages = function(state){
				$scope.state = state;
			}

    }]);

    return app;
});