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
	            templateUrl: '/views/front-end/nav-tree.html',
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

	    directives.directive('fileUpload', ['$timeout',
        function($timeout) {
	      return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {

	        	function handleFileSelect(evt) {
				  var f = evt.target.files[0];
				  var reader = new FileReader();
				  reader.onload = (function(theFile) {
				    return function(e) {
				      var filePayload = e.target.result;
				      scope.$emit("fileSelected", filePayload);
				      scope.$apply();
				    };
				  })(f);

				  reader.readAsDataURL(f);
				}

				$(element).change(handleFileSelect);
	            
	        }
	      };
	    }]);

});