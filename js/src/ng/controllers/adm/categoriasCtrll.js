define(['app'], function(app){

	app.controller('categoriasCtrll', ['$scope', '$firebaseArray', 'Slug', 'configService', function($scope, $firebaseArray, Slug, configService){

		configService.load().then(function(appConfig){
            var categoriasRef = firebase.database().ref(appConfig.categoriasRef);
			$scope.categorias = $firebaseArray(categoriasRef);
        });

		$scope.editing = {};

		$scope.adicionarCategoria = function(){
			console.log($scope.addCategoriaNome);
			console.log($scope.addCategoriaPai);

			if($scope.canAdd($scope.addCategoriaNome) != true){ return; }

			$scope.categorias.$add({
			  nome: $scope.addCategoriaNome,
			  pai: ($scope.addCategoriaPai)? $scope.addCategoriaPai : 0,
			  creationDate : firebase.database.ServerValue.TIMESTAMP,
			  slug: Slug.slugify($scope.addCategoriaNome)
			});
		}

		$scope.canAdd = function(nomeCategoria){
			var valid = true;
			if(nomeCategoria){
				angular.forEach($scope.categorias, function(value, key){
					if(value.nome == nomeCategoria){ valid = false; }
				});
				return valid;
			}
		}
		
		$scope.canSave = function(nomeCategoria){
			var i = 0;
			if(nomeCategoria){
				angular.forEach($scope.categorias, function(value, key){
					if(value.nome == nomeCategoria){ i++; }
				});
				return i;
			}
		}

		$scope.toggleEdit = function(id){
			$scope.editing[id] = ($scope.editing[id])? false : true;
			console.log($scope.editing);
		}
        
        $scope.guardarCategoria = function(categoria){
        	if($scope.canSave(categoria.nome) > 1){ return; }

        	categoria.slug = Slug.slugify(categoria.nome);

        	$scope.categorias.$save(categoria).then(function(ref) {
			  console.log("saved");
			});
			$scope.toggleEdit(categoria.$id);
        }

    }]);

    return app;
});