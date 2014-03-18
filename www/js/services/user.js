/**
 * User object
 */
starter.factory('user', function($rootScope, $http, application) {
  var self = {
    session: {
      session_name:null,
      sessid:null,
    },
    profile:{},
    csrf: null,
    username: 'Rob',
    password: 'sasquatch123',
    connect_url: application.base_url + 'system/connect.json',
    token_url: application.base_url + 'user/token.json',
    login_url: application.base_url + 'user/login.json',
    logout_url: application.base_url + 'user/logout.json',
    user_crud_url: application.base_url + 'user',
    file_crud_url: application.base_url + 'file',

    build_headers: function() {
      var config = {
        headers: { }
      }

      if (self.csrf != null) {
        config.headers['X-CSRF-Token'] = self.csrf
      }
      // if (typeof(self.session.session_name) != 'undefined' && typeof(self.session.sessid) != 'undefined') {
      //     config.headers['Cookie'] = self.session.session_name + '=' + self.session.sessid
      // }
      return config;
    },
    store_profile: function(data) {
       self.profile = data;
       console.log(self.profile);
       $rootScope.$broadcast('updateUserProfile');
    },
    is_logged_in: function() {
      user.connect();
    },
    token: function(tokenSuccess, tokenFailure) {
      var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': '' + self.session.session_name + '=' + self.session.sessid
      };
      var postData = {};
      console.log('attempting to retrieve a csrf token.');
      $http.post(self.token_url, postData, headers).
        success(function(data, status, headers, config) {
          self.csrf = data.token;
          console.log('successfully retrieved a csrf token.');
          console.log('csrf token: ' + self.csrf);
          self.token_save();
          tokenSuccess();
      }).error(function(data, status, headers, config) {
          console.log('failed to retrieve a csrf token.');
          tokenFailure();
      });
    },

    connect: function (connectSuccess,connectFailure) {


      alert(self.csrf);



      // Set data
      var postData = {};

      // Set config
      var config = self.build_headers();

      console.log('attempting to connect to drupal site.');
      $http.post(self.connect_url, postData, config).
        success(function(data, status, headers, config) {
          console.log('successful connection to drupal site');
          // save the session data
          self.session = {
            'sessid': data.sessid,
            'session_name' : data.session_name
          };

          self.store_profile(data.user);


          connectSuccess();
      }).error(function(data, status, headers, config) {
        console.log('failed connection to drupal site');
        alert(JSON.stringify(data));
        connectFailure();
      });
    },

    login:function(loginSuccess, loginFailure) {

      // if we have the session and a token then we are good.
      if ( typeof(self.session.sessid) != 'undefined' &&
        typeof(self.session.session_name) != 'undefined' &&
        typeof(self.csrf) != 'undefined' && self.profile.uid != 0 ) {
            loginSuccess();
      } else {

     var config = self.build_headers();

        var postData = {
          'username':self.username,
          'password':self.password
        };

        console.log('attempting to login to drupal site.');
          $http.post(self.login_url, postData, config).
            success(function(data, status, headers, config) {
              console.log('successfully logged in to drupal site.');
              self.session = {
                'sessid': data.sessid,
                'session_name' : data.session_name
              };

              self.store_profile(data.user);

              alert('manual login :)');
              // go get a token
              loginSuccess();

          }).error(function(data, status, headers, config) {
             console.log('failed to login to drupal site.');
            alert(JSON.stringify(data));

          });

      }

        // Set config
      // var config = {
      //   headers: {
      //       'X-CSRF-Token': self.csrf,
      //     }
      // }


    },

    file_create: function(file, fileCreateSuccess, fileCreateFailure) {

   var config = self.build_headers();

   alert(JSON.stringify(config));

      var postData = file;

      $http.post(self.file_crud_url + '.json' , postData, config).
        success(function(data, status, headers, config) {
          fileCreateSuccess(data);

      }).error(function(data, status, headers, config) {
         alert(JSON.stringify(data));
      });

      // returns fid
    },

    user_retrieve: function(id, userRetrieveSuccess, userRetrieveFailure) {
      var config = self.build_headers();

      var postData = {};

      $http.get(self.user_crud_url + '/' + id + '.json', postData, config).
        success(function(data, status, headers, config) {
          console.log('successfully retrieved user with id.' + id);
          userRetrieveSuccess(data);
      }).error(function(data, status, headers, config) {
         console.log('failed to retrieve user with id.' + id);
         alert(JSON.stringify(data));
      });


    },
    user_create: function(data, userCreateSuccess, userCreateFailure) {
      var config = self.build_headers();
      var postData = data;
      $http.post(self.user_crud_url + '.json', postData, config).
        success(function(data, status, headers, config) {
          console.log('successfully created user with id.');
          userCreateSuccess(data);
      }).error(function(data, status, headers, config) {
         console.log('failed to create user with id.');
         userCreateFailure(data);
      });
    },
    logout:function(logoutSuccess,logoutFailure) {
      var config = self.build_headers();
      console.log('attempting to logout');

      $http.post(self.logout_url, {}, config).
        success(function(data, status, headers, config) {
          console.log('successfully logged out');
          logoutSuccess();

          alert(JSON.stringify(data));
      }).error(function(data, status, headers, config) {
           console.log('failed to logout');
        alert(JSON.stringify(data));

      });
    },
    create:function() {

    },
    update:function() {

    },
    update_field:function() {

    },
    delete: function() {

    },
    token_load: function() {
      console.log('loading csrf token from local storage.');
      var csrf = window.localStorage.getItem('csrf');
      self.csrf = csrf;
    },
    // Save the profile
    token_save: function() {
      console.log('saving csrf token to local storage.');
      window.localStorage.setItem('csrf', self.csrf);
    },
    session_load: function() {
      console.log('loading session from local storage.');
      var session = window.localStorage.getItem('session');
      self.session = JSON.parse(session);
    },
    // Save the profile
    session_save: function() {
      console.log('saving session to local storage.');
      window.localStorage.setItem('session', JSON.stringify(self.session));
    },
    geofieldToMarker: function(field) {

    }


  };
  return self;
});
