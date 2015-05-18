define(['app'], function(app){

  	app.controller('loginCtrll', ['$scope', '$rootScope', '$firebaseAuth', '$location', function($scope, $rootScope, $firebaseAuth, $location){

  		var authObj = $firebaseAuth($rootScope.firebaseAuthRef);

      $scope.loginEmail = 'teste@teste.com';
      $scope.loginPassword = 'teste';

  		$scope.login = function() {
          $scope.authData = null;
          $scope.error = null;

          console.log($scope.loginEmail);
          console.log($scope.loginPassword);

          authObj.$authWithPassword({
              email: $scope.loginEmail,
              password: $scope.loginPassword
            }).then(function(authData) {
              $location.url("/adm-home");
            }).catch(function(error) {
              console.error("Authentication failed:", error);
            });
        };
        
    }]);

    return app;
});