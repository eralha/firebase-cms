define(['app'], function(app)
{
    var directives = angular.module('app.Directives', []);

	    directives.directive("navTree", function(RecursionHelper) {
	        return {
	            restrict: "E",
	            scope: {
	              data: '=',
	              idItems: '='
	            },
	            templateUrl: '../views/front-end/nav-tree.html',
	            compile: function(element) {
	                return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){

	                    scope.categorias = new Array();

	                    scope.$watch('data', function(){
	                        angular.forEach(scope.data, function(value, key){
	                            value.$id = key;
	                            if(value.pai == scope.idItems){ 
	                                scope.categorias.push(value);
	                            }
	                        });
	                    }, true);

	                });
	            }
	        };
	    });

});