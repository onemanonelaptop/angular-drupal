// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'google-maps'])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      .state('map', {
        url: "/map",
        templateUrl: "templates/map/map.html",
        controller: 'MapCtrl'
      })
      .state('menu', {
        url: "/menu",
        templateUrl: "templates/menu.html",
        controller: 'MenuCtrl'
      })
     .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html",
      controller: 'SignupCtrl'
    })
   .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })
    .state('home', {
      url: "/home",
      templateUrl: "templates/help.html"
    })
    .state('friends', {
      url: "/friends",
      abstract:true,
      templateUrl: "templates/friends/friends.html"
    })
    .state('friends.add', {
      url: '/add',
      views: {
        'add-friends': {
          templateUrl: 'templates/friends/friends-add.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('friends.contacts', {
      url: '/contacts',
      views: {
        'add-friends': {
          templateUrl: 'templates/friends/friends-add-contacts.html',
          controller: 'FriendsContactsCtrl'
        }
      }
    })
    .state('friends.edit', {
      url: '/edit',
      views: {
        'edit-friends': {
          templateUrl: 'templates/friends/friends-edit.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('friends.view', {
      url: '/view',
      views: {
        'view-friends': {
          templateUrl: 'templates/friends/friends-view.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('profile', {
      url: "/profile",
      abstract:true,
      templateUrl: "templates/profile.html"
    })
    .state('profile.edit', {
      url: '/edit',
      views: {
        'edit-profile': {
          templateUrl: 'templates/profile-edit.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('profile.view', {
      url: '/view',
      views: {
        'view-profile': {
          templateUrl: 'templates/profile-view.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",

      templateUrl: "templates/tabs.html"
    })

     .state('tab.profile', {
      url: '/profile',
      views: {
        'profile-tab': {
          templateUrl: 'templates/profile.html',
          controller: 'PetIndexCtrl'
        }
      }
    })

    // the pet tab has its own child nav-view and history
    .state('tab.pet-index', {
      url: '/pets',
      views: {
        'pets-tab': {
          templateUrl: 'templates/pet-index.html',
          controller: 'PetIndexCtrl'
        }
      }
    })

    .state('tab.pet-detail', {
      url: '/pet/:petId',
      views: {
        'pets-tab': {
          templateUrl: 'templates/pet-detail.html',
          controller: 'PetDetailCtrl'
        }
      }
    })

    .state('tab.adopt', {
      url: '/adopt',
      views: {
        'adopt-tab': {
          templateUrl: 'templates/adopt.html'
        }
      }
    })

    .state('tab.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/pets');

});

