/**
 * Facebook factory
 */
starter.factory('facebook', function($rootScope, application) {
    var self = {
        init: function() {
            try {
                FB.init({
                    appId: application.facebook.appId,
                    nativeInterface: CDV.FB,
                    useCachedDialogs: false
                });
            } catch (e) {
                alert(e);
            }
        },

        getUser: function(successCallback, errorCallback) {
            FB.api('/me', {
                fields: application.facebook.userFields
            }, function(response) {
                if (!response.error) {
                    successCallback(response);
                } else {
                    errorCallback(response);
                }
            });
        },

        logged_in: function() {
            self.getLoginStatus();
            return !!application.facebook.userId;
        },

        getLoginStatus: function() {
            FB.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    application.facebook.connected = true;
                    application.facebook.accessToken = response.authResponse.accessToken;
                    application.facebook.userId = response.authResponse.userId;
                }
            });
        },

        login: function(successCallback, errorCallback) {
            FB.login(function(response) {
                if (response.authResponse) {
                    application.facebook.connected = true;
                    application.facebook.accessToken = response.authResponse.accessToken;
                    application.facebook.userId = response.authResponse.userId;

                    successCallback(response);
                } else {
                    errorCallback(response);
                }
            }, {
                scope: application.facebook.scope
            });
        },

        logout: function(callback) {
            FB.logout(function(response) {
                callback(response);
            });
        },

        wallPost: function() {
            var params = {
                method: 'feed',
                name: 'Facebook Dialogs',
                link: 'https://developers.facebook.com/docs/reference/dialogs/',
                picture: 'http://fbrell.com/f8.jpg',
                caption: 'Reference Documentation',
                description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
            };

            FB.ui(params, function(obj) {
                alert(JSON.stringify(obj));
            });
        }
    };
    return self;
});
