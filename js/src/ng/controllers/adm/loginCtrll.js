define(['app'], function(app){

  	app.controller('loginCtrll', ['$scope', '$rootScope', '$firebaseAuth', '$location', function($scope, $rootScope, $firebaseAuth, $location){

  		var authObj = $firebaseAuth();

      $scope.loginEmail = 'teste@teste.teste';
      $scope.loginPassword = 'teste01';

  		$scope.login = function() {
          $scope.authData = null;
          $scope.error = null;

          console.log($scope.loginEmail);
          console.log($scope.loginPassword);

          authObj.$signInWithEmailAndPassword($scope.loginEmail, $scope.loginPassword).then(function(authData) {
              $location.url("/adm-home");
            }).catch(function(error) {
              $scope.authError = error.message;
              console.error("Authentication failed:", error);
            });
        };
        
    }]);

    return app;
});