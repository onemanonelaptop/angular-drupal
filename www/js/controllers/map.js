function MapCtrl($rootScope, $scope, $location, $http, $timeout, user, friends) {





    $timeout(function () {
        dynamicMarkers = [
            {
                latitude: 46,
                longitude: -79,
                showWindow: false
            },
            {
                latitude: 33,
                longitude: -79,
                showWindow: false
            },
            {
                icon: 'plane.png',
                latitude: 35,
                longitude: -127,
                showWindow: false
            }
        ];

        $scope.map.dynamicMarkers = dynamicMarkers;
    }, 2000);


}
