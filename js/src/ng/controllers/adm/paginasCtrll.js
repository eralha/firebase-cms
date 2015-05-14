define(['app'], function(app){

	app.controller('paginasCtrll', ['$scope', '$firebaseArray', 'Slug', 'appConfig', function($scope, $firebaseArray, Slug, appConfig){

		var paginasRef = new Firebase(appConfig.paginasRef);

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

			$scope.paginas = $firebaseArray(paginasRef);

    }]);

    return app;
});