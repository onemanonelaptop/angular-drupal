function SignupCtrl($rootScope, $scope, $http, $ionicModal, user) {

  // Store the new user details
  $scope.newuser = {
    'name' : '',
    'mail' : '',
    'pass' : '',
    'pass1':'',
    'status' : 1
  };

  $scope.drupalerrors = {};

  // Load the modal from the given template URL
  $scope.attemptSignup = function() {
      $scope.drupalerrors = {};
      $scope.signupForm.submitted = false;

      // If the signup form validated
      if($scope.signupForm.$valid){

        var postData = $scope.newuser;

        // Attempt to create the user on the drupal site.
        user.user_create(postData, function(data) {
          alert(JSON.stringify(data));
        }, function(data) {
          alert(JSON.stringify(data));
            $scope.signupForm.submitted = true;
            $scope.drupalerrors = data.form_errors;
        });
      } else {
        // if the form was invalid set the submitted flag to true so we can display errors.
        $scope.signupForm.submitted = true;
      }
  }

}
