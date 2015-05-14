define(['app'], function(app){

	app.controller('paginasEditCtrll', ['$scope', '$firebaseArray', 'Slug', '$routeParams', 'appConfig', 
									function($scope, $firebaseArray, Slug, $routeParams, appConfig){

		$scope.page = {};
		$scope.state = 'add';

		var categoriasRef = new Firebase(appConfig.categoriasRef);
			$scope.categorias = $firebaseArray(categoriasRef);

		var paginasRef = new Firebase(appConfig.paginasRef);
			paginasRef.orderByChild("titulo").startAt('sd').on("value", function(snapshot) {
			  console.log(snapshot.val());
			});

			$scope.paginas = $firebaseArray(paginasRef);

		$scope.$watch('paginas', function(oldv, newv){
			if($routeParams.id){
				$scope.state = 'save';
				var page = $scope.paginas.$getRecord($routeParams.id);
				$scope.page = (page)? page : {};
			}
		}, true);

		$scope.$watch('page', function(oldv, newv){
			$scope.saved = false;
			$scope.trashed = false;
		}, true);

		function slugExists(slug){
			var match = false;
			angular.forEach($scope.paginas, function(value, key){
				if(value.slug == slug && value.state == "available"){ 
					match = true; 
					console.log(value.slug);
				}
            });
            return match;
		}
		function generateSlug(slug){
			var pointer = (arguments[1])? arguments[1] : 0;
			if(slugExists(slug) && !arguments[1]){
				pointer ++;
				pointer = generateSlug(slug, 1);
			}
			if(slugExists(slug+'-'+arguments[1]) && arguments[1]){
				arguments[1]++;
				pointer = generateSlug(slug, arguments[1]);
			}
			return pointer;
		}

		$scope.slug = function(name){
			var slug = Slug.slugify(name);
			var pointer = generateSlug(slug);
			slug = (pointer > 0)? slug+'-'+pointer : slug;
			console.log(slug);
			return slug;
		}

		$scope.canSave = function(){
			return true;
		}

		$scope.guardarPagina = function(){
			$scope.page.parentNome = ($scope.page.parentId)? $scope.categorias.$getRecord($scope.page.parentId).nome : '';
			$scope.page.state = ($scope.page.state)? $scope.page.state : 'available';
			$scope.page.slug = $scope.slug($scope.page.titulo);
			$scope.page.lastEditDate = Firebase.ServerValue.TIMESTAMP;

			if(!$scope.pageForm.$valid){ return; }

			if($scope.state == 'save'){
				$scope.paginas.$save($scope.page).then(function(ref) {
	        	  $scope.saved = true;
				});
			}

			if($scope.state == 'add'){
				$scope.page.creationDate = Firebase.ServerValue.TIMESTAMP;
				$scope.paginas.$add($scope.page).then(function(ref) {
	        	  $scope.saved = true;
				});
			}
		}

		$scope.apagarPagina = function(){
			$scope.saved = false;
			$scope.trashed = true;
			$scope.page.state = 'trashed';
			if($scope.state == 'save'){
				$scope.paginas.$save($scope.page).then(function(ref) {});
			}
		}

    }]);

    return app;
});