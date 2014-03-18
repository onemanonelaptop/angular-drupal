function LoginCtrl($rootScope, $scope, $location, $http, user) {

	// Set the form defaults.
	$scope.email = '';
	$scope.password = '';

	$scope.attemptLogin = function() {

		user.login(function() {

      console.log(user.profile);
       $rootScope.loggedIn = true;
      alert('logged in, yey');
      user.token(function() {
         $rootScope.$broadcast('loggedInUser');


      }, function() {
        alert('no token');
      });
    }, function() {});
	}

	$scope.rightButtons = [
  {
    type: 'button-positive',
    content: 'Register',
    tap: function(e) {
      $location.path('signup');
    }
  }
];
  $scope.leftButtons = [
    {
      type: 'button-positive',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
      }
    }
  ];
}
