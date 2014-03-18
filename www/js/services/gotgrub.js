

starter.factory('gotgrub', function($rootScope, $http) {
  var self = {
    menu:{},
    getRestaurant : function() {
      var url = 'http://gotgrub.co.uk/api/restaurant/65.json';
      $http.get(url, {}, {}).
        success(function(data, status, headers, config) {
        self.restaurant = data;
        console.log(data);
        $rootScope.$broadcast('restaurantUpdated');
        alert(JSON.stringify(data));
      }).error(function(data, status, headers, config) {
        alert(JSON.stringify(data));
      });
    },
    getMenu : function() {
      var url = 'http://gotgrub.co.uk/api/menu/65.json';
      $http.get(url, {}, {}).
        success(function(data, status, headers, config) {
        self.menu = data;
        console.log(data);
        $rootScope.$broadcast('menuUpdated');
        alert(JSON.stringify(data));
      }).error(function(data, status, headers, config) {
        alert(JSON.stringify(data));
      });
    }

  };
  return self;
});
