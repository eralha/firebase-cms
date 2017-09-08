define(['ng/routes',
    'services/dependencyResolverFor',
    'services/data-service',
    'services/recursionHelper',
    'directives/main',
    'lib/angularfire.2.3.0.min'
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

            if(config.defaultRoutePath !== undefined)
            {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePath});
            }
        }
    ]);
    
    //generic controlers go here
    app.controller('mainCtrll', ['$scope', '$rootScope', '$firebaseAuth', '$location', '$firebaseArray', 'datService',
                                function($scope, $rootScope, $firebaseAuth, $location, $firebaseArray, datService){

        datService.getData().then(function(){
            $scope.categorias = datService.categorias;
        });

    }]);

   return app;
});