/**
 * Main apllication controller atatached to the body of the page
 */
function AppCtrl($rootScope, $scope, $location, user, $ionicLoading, gotgrub, friends) {

   $scope.map = {
      center: {
          latitude: 45,
          longitude: -73
      },
      markers:[],
      zoom: 8
  };



  // Load up the latest data for the restaurant
  gotgrub.getRestaurant();
  $scope.$on("restaurantUpdated", function() {
    // store the restaurnt details in the rootscope.
    $scope.restaurant = gotgrub.restaurant;
  });

  // Load up the menu
  gotgrub.getMenu();
  $scope.$on("menuUpdated", function() {
    // store the menu details in the rootscope.
    $scope.menu = gotgrub.menu;
  });

  // Load up your friends
  $scope.friendsLoaded = false;
  $scope.$on("friendsUpdated", function() {
    // store the menu details in the rootscope.
    $scope.friends = friends.friends;
    $scope.map.markers = friendsToMarkers($scope.friends);

    $scope.friendsLoaded = true;
  });

  $scope.$on("contactsUpdated", function() {
    // store the menu details in the rootscope.
    $scope.contacts = friends.contacts;


  });

  $scope.$on("loggedInUser", function() {

     friends.retrieve();

     friends.contacts();
  });


  var friendsToMarkers = function(friends) {
    var markers = [];
    var arrayLength = friends.length;
    for (var i = 0; i < arrayLength; i++) {
        console.log(typeof(friends[i].field_user_location));
        if (typeof(friends[i].field_user_location) == 'object') {
          markers[i] = {
            uid: friends[i].uid,
            latitude: friends[i].field_user_location[0].lat,
            longitude: friends[i].field_user_location[0].lon,
            showWindow: false,
          }
        }

        //Do something
    }
    return markers;
  }



  // Start off logged out.
  $rootScope.loggedIn = false;

  $scope.profile = user.profile;
  $scope.$on("updateUserProfile", function() {
    // Set the model to the friends stored in the rootscope.
    $scope.profile = user.profile;
    console.log($scope.profile);
  });

  $scope.attemptLogout = function() {
      user.logout(function() {
         $rootScope.loggedIn = false;
      });
  };

// Trigger the loading indicator
  $scope.show = function(loadingContent) {


    loadingContent = typeof loadingContent !== 'undefined' ? loadingContent : 'Loading';

    // Show the loading overlay and text
    $scope.loading = $ionicLoading.show({

      // The text to display in the loading indicator
      content: loadingContent,

      // The animation to use
      animation: 'fade-in',

      // Will a dark overlay or backdrop cover the entire view
      showBackdrop: true,

      // The maximum width of the loading indicator
      // Text will be wrapped if longer than maxWidth
      maxWidth: 200,

      // The delay in showing the indicator
      showDelay: 0
    });
  };

  // Hide the loading indicator
  $scope.hide = function(){
    $scope.loading.hide();
  };


  // Called by /js/controllers/app.js
    $scope.reLaunch = function() {
      // on relaunch check if the user is still logged in, if not goto login screen

        $scope.show('Logging in.');

        user.token(function() {
          user.connect(function() {
              if (user.profile.uid == 0) {
                $scope.hide();
                $location.path('login');
                console.log('user wasnt logged in');
                $rootScope.loggedIn = false;
              } else {
                $rootScope.loggedIn = true;
                console.log('user was logged in');
                $rootScope.$broadcast('loggedInUser');
                user.user_retrieve(user.profile.uid, function(data) {
                  user.store_profile(data);
                  $scope.hide();
                }, function() {

                });
              }
          }, function () {

          });

        }, function() {});








        // if we are not logged in the show the login screen.
        // user.token(function() {
        //     user.connect(function() {
        //         console.log(user.profile);
        //         if (user.profile.uid == 0) {
        //             console.log('not logged in');
        //             $scope.hide();
        //             $location.path('login');
        //             $scope.loggedIn = false;
        //         } else {
        //           $scope.loggedIn = true;
        //             // already logged in
        //             // $location.path('menu');
        //             alert('logged in :)');
        //             user.user_retrieve(user.profile.uid, function(data) {
        //               user.store_profile(data);
        //               // user.file_create({}, function(data) {
        //               //   alert(JSON.stringify(data));
        //               // }, function() {});
        //             }, function() {

        //             });
        //             $scope.hide();
        //         }
        //     }, function() {});
        //  }, function() {});




    };

}
