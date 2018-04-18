define(['app'], function(app){

	app.controller('paginasCtrll', ['$scope', '$firebaseArray', 'Slug', 'configService', 'datService', 
		function($scope, $firebaseArray, Slug, configService, datService){

		$scope.state = 'available';
		$scope.messages = {};

		$scope.loading = true;
		configService.load().then(function(appConfig){
            var paginasRef = firebase.database().ref(appConfig.pagesRef);
				$scope.paginas = $firebaseArray(paginasRef);
				
				$scope.paginas.$loaded().then(function(x) {
					console.log("Success");
					$scope.loading = false;
				}).catch(function(error) {
					console.error("Error:", error);
					$scope.loading = false;
					$scope.paginas = [];
				});
        });

			/*
			paginasRef.orderByChild("state").equalTo('available').on("value", function(snapshot) {
			  $scope.paginas = snapshot.val();
			  $scope.$apply();
			});
			*/
			$scope.setMessage = function(info){
	            $scope.messages = {};
	            $scope.messages[info] = true;
	            console.log($scope.messages);
	            setTimeout(function(){
	                $scope.messages = {};
	                $scope.$apply();
	            }, 2000);
	        }

			$scope.permaDelete = function(page){
				$scope.setMessage('pageDeleted');
				datService.deletePageImages(page.$id).then(function(images){
					console.log(images);
					$scope.paginas.$remove(page).then(function(ref) {});
				});
			}

			$scope.sendToTrash = function(page){
				page.state = 'trashed';
				$scope.setMessage('pageTrashed');
				$scope.paginas.$save(page).then(function(ref) {});
			}

			$scope.filterPages = function(state){
				$scope.state = state;
			}

    }]);

    return app;
});