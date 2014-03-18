function FriendsCtrl($rootScope, $scope, $http, $ionicModal, user, friends) {
  $scope.showDelete = 0;

  $scope.friendButtons = [
    {
      text: 'Edit',
      type: 'button-assertive',
      onTap: function(item) {
        alert('Edit Item: ' + item.id);
      }
    },
    {
      text: 'Share',
      type: 'button-calm',
      onTap: function(item) {
        alert('Share Item: ' + item.id);
      }
    }
  ];


   $scope.onFriendDelete = function() {

   }


}

function FriendsContactsCtrl($rootScope, $scope, $http, $ionicModal, user, friends) {
 $scope.rightButtons = [
  {
    type: 'button-positive',
    content: 'Save',
    tap: function(e) {
      alert('saved');
    }
  }
]

}
