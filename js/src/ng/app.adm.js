define(['ng/routes.adm','services/dependencyResolverFor'], function(config, dependencyResolverFor)
{
    var app = angular.module('app', ['ngRoute', 'firebase', 'slugifier']);

    app.constant('appConfig', {
      firebaseRef: 'https://er-angular-cms.firebaseio.com/',
      categoriasRef: 'https://er-angular-cms.firebaseio.com/categorias',
      paginasRef: 'https://er-angular-cms.firebaseio.com/paginas'
    });

    app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            //$locationProvider.html5Mode(true);

            if(config.routes !== undefined)
            {
                angular.forEach(config.routes, function(route, path)
                {
                    $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                });
            }

            if(config.defaultRoutePaths !== undefined)
            {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }
        }
    ]);
    
    //generic controlers go here
    app.controller('mainCtrll', ['$scope', '$rootScope', '$firebaseAuth', '$location', 'appConfig', function($scope, $rootScope, $firebaseAuth, $location, appConfig) {

        $rootScope.firebaseAuthRef = new Firebase(appConfig.firebaseRef);
        $scope.authData = null;

        var authObj = $firebaseAuth($rootScope.firebaseAuthRef);
        var authData = authObj.$getAuth();

        $scope.parseLocation = function(){
            return ($scope.authData == null)? false : true;
        }

        $scope.logOut = function(){
            authObj.$unauth();
        }

        $scope.isSelectedNavigation = function(path){
            return (String($scope.path).indexOf(path) != -1)? true : false;
        }

        authObj.$onAuth(function(authData) {
          if (authData){
            $scope.authData = authData;
            console.log("Logged in as:", authData.uid);
            $location.url("/adm-home");
          }else{
            $scope.authData = null;
            $location.url("/login");
            console.log("not logged");
          }
        });

        $scope.$on('$locationChangeStart', function(e, next, current){
            $scope.path = $location.path();
            console.log($scope.path);
            if($scope.parseLocation() == false){ 
                $location.url("/login");
            }
        });

    }]);

   return app;
});