// Will be filled in onDeviceReady()
var pushNotification;

var pushObj = function($rootScope, $http, user, application, alerts) {
	this.me = {

		// Google Cloud Messaging
		onNotificationGCM: function(e) {
			switch (e.event) {
				// Save the device token
				case 'registered':
					if (e.regid.length > 0) {
						this.saveDeviceToken(e.regid);
					}
					break;

				case 'message':
					if (e.foreground) {
						// if this flag is set, this notification happened while we were in the foreground.
						// you might want to play a sound to get the user's attention, throw up a dialog, etc.
						//alert('Inline notification');
					}
					// Otherwise we were launched because the user touched a notification in the notification tray.
					else if (e.coldstart) {
						//alert('Coldstart notification');
					} else {
						//alert('Background notification');
					}

					break;

				case 'error':
					this.errorHandler(e.msg);
					break;
			}
		},

		// Apple Push Notification
		onNotificationAPN: function(event) {
			alert('APN!');
			alert(JSON.stringify(event));
			if (event.alert) {
				alerts.alert(event.alert, 'Notifications');
			}

			if (event.sound) {
				var snd = new Media(event.sound);
				snd.play();
			}

			if (event.badge) {
				window.plugins.pushNotification.setApplicationIconBadgeNumber(function() {
					alert('success');
				}, function() {
					alert('error');
				}, event.badge);
			}
		},

		// Generic error handler
		errorHandler: function(error) {
			alerts.alert(error, 'Notifications');
		},

		// Post the token to the server
		saveDeviceToken: function(token) {
			// Prepare the data
			var postData = {
				device_token: token
			};
			user.addCredentials(postData);

			$http
				.post(user.update_token_url, postData)
				.success(function(data, status, headers, config) {})
				.error(function(data, status, headers, config) {});
		},

		// Register for push notifications
		register: function() {
			// If the user already has a token just leave.
			if (user.profile.device_token) {
				return;
			}

			var self = this;

			// Android fires an event under onNotificationGCM to handle saving device token
			var androidSuccess = function(result) {};

			// Apple tells the success function the device token
			var appleSuccess = function(result) {
				self.saveDeviceToken(result);
			};

			if (user.device_type == 'android') {
				window.plugins.pushNotification.register(androidSuccess, self.errorHandler, {
					'senderID': application.gcm.appId,
					'ecb': 'push.me.onNotificationGCM'
				});
			} else {
				window.plugins.pushNotification.register(appleSuccess, self.errorHandler, {
					'badge': 'true',
					'sound': 'true',
					'alert': 'true',
					'ecb': 'push.me.onNotificationAPN'
				});
			}
		}
	};
};


// Create the factory service for mapping.
tribe.factory('push', function($rootScope, $http, user, application, alerts) {
	push = new pushObj($rootScope, $http, user, application, alerts);
	return push.me;
});
