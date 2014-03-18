function ProfileCtrl($rootScope, $scope, $http,$ionicModal, user, camera) {
  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('avatarmodal.html', function(modal) {
    $scope.avatarmodal = modal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });



  $scope.openAvatarModal = function() {
    $scope.avatarmodal.show();
  };
  $scope.closeAvatarModal = function() {
    $scope.avatarmodal.hide();
  };

  $scope.useExistingPicture = function() {
    $scope.avatarmodal.hide();
  }

  $scope.takeNewPicture = function() {
      // hide the modal popup
      $scope.avatarmodal.hide();

      // specify the options for the camera
      var options = {
        sourceType: 1,
        'resize' : false,
        'width' : 500
      };

      // Try and take a photo
      camera.getPicture(options, function(imageData) {
        // success
        alert('success pciture');

        // specify the file object to send to drupal
        var file = {
          file : imageData,
          filename : 'test.jpg'
        };



        // create a new file in drupal using the image data.
        user.file_create(file, function(data) {
          alert(JSON.stringify(data));
        }, function() {});

      }, function() {
        // failure
        alert('fail pciture');
      });


  }

}
