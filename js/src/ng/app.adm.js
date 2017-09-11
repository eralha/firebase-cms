define([
    'ng/routes.adm',
    'services/dependencyResolverFor',
    'services/data-service',
    'services/recursionHelper',
    'directives/main',
    'lib/angularfire.2.3.0.min',
    'lib/ng-cookies',
    'lib/slugify'
    ], function(config, dependencyResolverFor)
{
    var app = angular.module('app', ['ngRoute', 'firebase', 'slugifier', 'RecursionHelper', 'app.Services', 'app.Directives']);

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
    app.controller('mainCtrll', ['$scope', '$rootScope', '$firebaseAuth', '$location', 'configService', 
                            function($scope, $rootScope, $firebaseAuth, $location, configService) {

        $rootScope.firebaseAuthRef = null;
        $scope.authData = null;

        var authObj = null;
        var authData = null;

        configService.load().then(function(appConfig){
            $scope.authData = null;

            authObj = $firebaseAuth();
            authData = authObj.$getAuth();

            authObj.$onAuthStateChanged(function(authData) {
              if (authData){
                $scope.authData = authData;
                //console.log("Logged in as:", authData.uid);
                $location.url("/adm-home");
              }else{
                $scope.authData = null;
                $location.url("/login");
                //console.log("not logged");
              }
            });
        });

        $scope.parseLocation = function(){
            return ($scope.authData == null)? false : true;
        }

        $scope.logOut = function(){
            authObj.$unauth();
        }

        $scope.isSelectedNavigation = function(path){
            return (String($scope.path).indexOf(path) != -1)? true : false;
        }

        $scope.$on('$locationChangeStart', function(e, next, current){
            $scope.path = $location.path();
            //console.log($scope.path);
            if($scope.parseLocation() == false){ 
                $location.url("/login");
            }
        });

    }]);

   return app;
});