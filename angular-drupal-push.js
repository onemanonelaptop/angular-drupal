// Define some global objects so we can access
var pushObj = function($rootScope, $http, drupal, user) {
    this.me = {}
}

angular.module('angular.drupal.push', [])
    .factory('push', function($rootScope, $http, drupal) {
        push = new pushObj($rootScope, $http, drupal);
        push.me = {
            gcm: {
                senderID: null
            },
            register: function() {

                if (typeof(device) == 'undefined') {
                    return false;
                }
                // If we are on an android device then use GCM
                if (device.platform == 'android' || device.platform == 'Android') {
                    window.plugins.pushNotification.register(
                        function(result) {

                        },
                        function(error) {

                        }, {
                            "senderID": "601941788994",
                            "ecb": "drupal.me.onNotificationGCM"
                        });
                } else {
                    window.plugins.pushNotification.register(
                        tokenHandler,
                        errorHandler, {
                            "badge": "true",
                            "sound": "true",
                            "alert": "true",
                            "ecb": "onNotificationAPN"
                        });
                }
            },
            onNotificationGCM: function(event) {
                alert('registered for push');
                switch (event.event) {

                    // Save the device token on regsitration
                    case 'registered':
                        if (event.regid.length > 0) {

                            user.push_create(event.regid, 'android', function(data) {
                                alert(JSON.stringify(data));
                            }, function(data) {
                                alert(JSON.stringify(data));
                            });

                        }
                        break;
                    case 'message':
                        if (event.coldstart || !event.foreground) {
                            event.foreground = 0;
                        }
                        return this.handleMessage(event);
                        break;
                    case 'error':
                        this.errorHandler(event.msg);
                        break;
                }
            },
        }
        return push.me;
    })