define(['app'], function(app){

	app.controller('paginasEditCtrll', ['$scope', '$firebaseArray', 'Slug', '$routeParams', 'configService', 
									function($scope, $firebaseArray, Slug, $routeParams, configService){

		$scope.page = {};
		$scope.state = 'add';

		configService.load().then(function(appConfig){
            var categoriasRef = new Firebase(appConfig.categoriasRef);
				$scope.categorias = $firebaseArray(categoriasRef);

			var paginasRef = new Firebase(appConfig.paginasRef);
				paginasRef.orderByChild("state").startAt('available').endAt('available').on("value", function(snapshot) {
				  //console.log(snapshot.val());
				});

			var imagesRef = new Firebase(appConfig.imagensRef);
				if($routeParams.id){
					imagesRef.orderByChild("owner").startAt($routeParams.id).endAt($routeParams.id).on("value", function(snapshot) {
					  var key = Object.keys(snapshot.val());
					  if(snapshot.val()){

					  }
					});
				}
				$scope.paginas = $firebaseArray(paginasRef);
				$scope.imagens = $firebaseArray(imagesRef);
        });

		$scope.$watch('paginas', function(oldv, newv){
			if($routeParams.id && !$scope.page.$id){
				$scope.state = 'save';
				var page = $scope.paginas.$getRecord($routeParams.id);
				$scope.page = (page)? page : {};
			}
		}, true);

		$scope.$on("fileSelected", function(e, data){
			$scope.pageImage = data;
		});

		/*
		$scope.$watch('page', function(oldv, newv){
			//$scope.saved = false;
			//$scope.trashed = false;
			console.log("page changed");
		}, true);
		*/

		function slugExists(slug){
			var match = false;
			angular.forEach($scope.paginas, function(value, key){
				if(value.slug == slug && value.state == "available"){ 
					match = true; 
					//console.log(value.slug);
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
		function setPageInfo(info){
			$scope.saved = false;
		    $scope.trashed = false;
			$scope[info] = true;
			setTimeout(function(){
	    	  	$scope[info] = false;
	    	  	$scope.$apply();
	    	}, 2000);
		}

		$scope.slug = function(name){
			var slug = Slug.slugify(name);
			var pointer = generateSlug(slug);
			slug = (pointer > 0)? slug+'-'+pointer : slug;
			return slug;
		}

		$scope.canSave = function(){
			return true;
		}

		$scope.guardarPagina = function(){
			$scope.page.parentNome = ($scope.page.parentId)? $scope.categorias.$getRecord($scope.page.parentId).nome : '';
			$scope.page.state = ($scope.page.state)? $scope.page.state : 'available';
			$scope.page.lastEditDate = Firebase.ServerValue.TIMESTAMP;

			if(!$scope.pageForm.$valid){ return; }

			if($scope.state == 'save'){
				$scope.paginas.$save($scope.page).then(function(ref) {
	        	  setPageInfo('saved');
	        	  //console.log("page saved");

	        	  if($scope.pageImage){
	        	  	var img = {};
	        	  		img.data = $scope.pageImage;
	        	  		img.owner = $scope.page.$id;
	        	  	$scope.imagens.$add(img).then(function(ref) {
					  console.log("added record with id " + ref.key());
					});
	        	  }

				});
			}

			if($scope.state == 'add'){
				$scope.page.slug = $scope.slug($scope.page.titulo);
				$scope.page.creationDate = Firebase.ServerValue.TIMESTAMP;
				$scope.paginas.$add($scope.page).then(function(ref) {
				  //console.log("added record with id " + ref.key());
	        	  setPageInfo('saved');
	        	  $scope.page = $scope.paginas.$getRecord(ref.key());
	        	  $scope.state = 'save';
				});
			}
		}

		$scope.apagarPagina = function(){
			$scope.saved = false;

			setPageInfo('trashed');

			$scope.page.state = 'trashed';
			if($scope.state == 'save'){
				$scope.paginas.$save($scope.page).then(function(ref) {});
			}
		}

    }]);

    return app;
});