/* Declare a new mapping object in the global scope to pass into the factory */
var mapObj = function($rootScope, $http, user, application) {
	this.me = {
		maps          : {},
		markers       : {},
		bubble        : {},
		lastCoords    : null,
		mapZoom       : 2,
		defaultCenter : {
			// UK
			lat : 55.378051,
			lng : -3.435973
		},
		// Init function to set default zoom level
		init: function() {
			if (typeof(user.profile.location) != 'undefined' && !!user.profile.location.lat) {
				this.mapZoom = 15;
			}
		},

		// Load the google maps API if it isn't already loaded
		load: function() {
			var self = this;

			// Test to see if the API is already available
			if (typeof google === 'object' && typeof google.maps === 'object') {
				// check to see if we already have the map in the rootscope.
				this.callback();
				if (typeof $rootScope.map != 'object') {
					// run the callback, this may be totally impossible to ever get here.
					this.callback();
				}
			} else {
				// load the google mpas api.
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=mapping.me.callback";
				document.body.appendChild(script);
			}
		},

		callback: function() {
			// Now the api is loaded, plot the map.
			$rootScope.$broadcast('mapReady');
		},

		setCenter: function(mapid, location) {
			this.maps[mapid].setCenter(new google.maps.LatLng(location.lat, location.lng));
			this.lastCoords = this.maps[mapid].getCenter();
		},

		panTo: function(mapid, location) {
			this.maps[mapid].panTo(new google.maps.LatLng(location.lat, location.lng));
			this.lastCoords = this.maps[mapid].getCenter();
		},

		markerToFront: function(mapid, markerid) {
			this.markers[mapid][markerid].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
		},

		gotoMarker: function(mapid, markerid) {
			var latLng = this.markers[mapid][markerid].getPosition();
			this.setCenter(mapid, {
				'lat': latLng.lat(),
				'lng': latLng.lng(),
			});
		},

		pantoMarker: function(mapid, markerid) {
			var latLng = this.markers[mapid][markerid].getPosition();
			this.panTo(mapid, {
				'lat': latLng.lat(),
				'lng': latLng.lng(),
			});
			$rootScope.currentmarkerid = markerid;
			this.markerToFront(mapid, markerid);
		},

		setZoom: function(mapid, zoom) {
			this.mapZoom = zoom;
			this.maps[mapid].setZoom(zoom);
		},

		createBubble: function() {
			this.bubble = new InfoBubble({
				map: $rootScope.map,
				content: '<div>Tribe</div>',
				shadowStyle: 1,
				padding: 0,
				backgroundColor: 'rgb(255,255,255)',
				borderRadius: 4,
				arrowSize: 10,
				borderWidth: 2,
				borderColor: '#00ac95',
				disableAutoPan: false,
				hideCloseButton: false,
				backgroundClassName: 'bubble-wrapper',
				arrowStyle: 0,
				minWidth: 190,
				maxWidth: 200,
				minHeight: 50,
				maxHeight: 250,
			});
		},

		updateBubble: function(data) {
			this.bubble.setContent(data);
		},

		plotMap: function(mapid) {
			// Define the default options for the google map.
			var defaults = {
				center: new google.maps.LatLng(this.defaultCenter.lat, this.defaultCenter.lng),
				zoom: this.mapZoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false,
				navigationControl: false,
				zoomControl: false
			};

			// Create the map using the defaults and save to the root scope.
			this.maps[mapid] = new google.maps.Map(document.getElementById(mapid), defaults);
			this.markers = {};

			if (this.lastCoords != null) {
				this.maps[mapid].setCenter(this.lastCoords);
			}

			var self = this;

			google.maps.event.addListener(self.maps[mapid], 'dragend', function() {
				self.lastCoords = self.maps[mapid].getCenter();
			});

			google.maps.event.addListener(self.maps[mapid], 'zoom_changed', function() {
				self.mapZoom = self.maps[mapid].getZoom();
			});
		},

		addMarker: function(mapid, marker) {
			// If this is the first marker make sure there is an array key to push onto.
			if (typeof(this.markers[mapid]) == 'undefined') {
				this.markers[mapid] = {};
			}

			// Store the reference to the new marker against the mapid and markerid.
			this.markers[mapid][marker.id] = new google.maps.Marker(marker);
		},

		moveMarker: function(mapid, markerid, location) {
			this.markers[mapid][markerid].setPosition(location);
		},
		// the smooth zoom function

		smoothZoom: function (mapid, max, cnt) {
		    if (cnt >= max) {
		            return;
		        }
		    else {
		    	   var self = this;
		        z = google.maps.event.addListener(this.maps[mapid], 'zoom_changed', function(event){
		            google.maps.event.removeListener(z);
		            self.smoothZoom(mapid, max, cnt + 1);
		        });

		        setTimeout(function(){self.setZoom(mapid, cnt)}, 200); // 80ms is what I found to work well on my system -- it might not work well on all systems
		    }
		},

		addBubble: function(mapid, markerid, callback) {
			// Store a reference to the current scope of 'this'.
			var self = this;
			google.maps.event.addListener(this.markers[mapid][markerid], 'click', function() {
				self.updateBubble(callback(self.markers[mapid][markerid].data));

				if (self.bubble.isOpen_ && self.current_marker == markerid) {
					self.bubble.close();
				} else {
					self.bubble.open(self.maps[mapid], this);
				}

				self.current_marker = markerid;
			});
		}
	};
};

// Declare in the global scope as we will need to call a method of this in the google api callback.
var mapping;

// Create the factory service for mapping.
starter.factory('mapSvc', function($rootScope, $http, user, application) {
	mapping = new mapObj($rootScope, $http, user, application);
	return mapping.me;
});

// map
starter.directive('map', ['$rootScope', '$timeout', 'mapSvc',
    function($rootScope, $timeout, mapSvc) {
        return {
            link: function($scope, element, attrs) {
                $timeout(function() {
                    mapSvc.load();
                }, 0, false);
            }
        };
    }
]);
