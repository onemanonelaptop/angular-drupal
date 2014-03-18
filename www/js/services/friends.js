


starter.factory('friends', function($rootScope, $http) {
  var self = {
    friends: [],
    invitesSent: [],
    invitesReceived: [],
    contacts: [],
    selectedContacts: [],
    retrieve: function() {
      var url = 'http://gotgrub.co.uk/app/friends.json';
      $http.get(url, {}, {}).
        success(function(data, status, headers, config) {
        self.friends = data.friends;
        console.log(data);
        $rootScope.$broadcast('friendsUpdated');
        alert(JSON.stringify(data));
      }).error(function(data, status, headers, config) {
        alert(JSON.stringify(data));
      });
    },
    contacts: function() {
      var onSuccess = function(contacts) {
        var cSort = function(a, b) {
          aName = a.name.givenName;
          bName = b.name.givenName;
          return aName < bName ? -1 : (aName == bName ? 0 : 1);
        };

        self.contacts = contacts.sort(cSort);
        alert(JSON.stringify(self.contacts));
        $rootScope.$broadcast('contactsUpdated');
      };

      var onError = function(contactError) {

      };

        var options = new ContactFindOptions();
        options.multiple = true;
        var fields = ["displayName", "name", "addresses", "emails"]; // retrieve name/address fields
        navigator.contacts.find(fields, onSuccess, onError, options);

   },


  };
  return self;
});
