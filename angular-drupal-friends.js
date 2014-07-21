angular.module('angular.drupal.friends', [])

// Friends
.factory('groups', function($rootScope, $http, $location, drupal) {
    var self = {
        data: [],
        index: function(data, options) {
            console.log('group index');
            drupal.entity.index('groups', {
                success: function(data) {
                    self.data = data;
                    $rootScope.$broadcast('groupsUpdated');
                    if (options.success) {
                        options.success(data);
                    }
                },
                failure: function(data) {
                    if (options.failure) {
                        options.failure(data);
                    }
                }
            });

        },
        create: function(data, options) {

            drupal.entity.create('groups', data, {
                success: function(data) {
                    $rootScope.$broadcast('groupsCreated');
                    if (options.success) {
                        options.success(data);
                    }
                },
                failure: function(data) {
                    if (options.failure) {
                        options.failure(data);
                    }
                }
            });

        },
        update: function(gid, data, options) {
            drupal.entity.update('groups', data, {
                success: function(data) {
                    $rootScope.$broadcast('groupsUpdated');
                    if (options.success) {
                        options.success(data);
                    }
                },
                failure: function(data) {
                    if (options.failure) {
                        options.failure(data);
                    }
                }
            });


        }
    }
    return self;
})
// Friends
.factory('friends', function($rootScope, $http, $location, drupal) {
    var self = {
        data: [],
        index: function(options) {
            drupal.entity.index('friends', {
                success: function(data) {
                    self.data = data;
                    localStorage.setItem("friends", JSON.stringify(self.data));
                    $rootScope.$broadcast('friendsUpdated');
                    if (options.success) {
                        options.success(data);
                    };
                },
                failure: function(data) {
                    if (options.failure) {
                        options.failure(data);
                    };
                }
            });
        },
        delete: function(id) {
            drupal.delete(drupal.services.url('friends/' + id + '.json'), function(data) {
                self.invites.data = data;
                $rootScope.$broadcast('friendDeleted');
            }, function(data, status) {
                if (status == "401") {

                    //   user.token(function() {}, function() {});

                    user.init(function() {}, function() {});
                }

            });
        },
        groups: {
            retrieve: function() {

            },
            create: function() {

            },
            leave: function() {

            },
            add: function() {

            }
        },
        invites: {
            data: [],
            accept: function(id) {
                drupal.put(drupal.services.url('invites/' + id + '.json'), {
                    'type': 'accept'
                }, function(data) {
                    self.invites.data = data;
                    console.log('accepted invite with id ' + id);
                    console.log(data);
                    $rootScope.$broadcast('inviteAccepted');
                }, function(data) {
                    alert(JSON.stringify(data));
                });
            },
            decline: function(id) {
                drupal.put(drupal.services.url('invites/' + id + '.json'), {
                    'type': 'decline'
                }, function(data) {
                    console.log('declined invite with id ' + id);
                    console.log(data);

                    $rootScope.$broadcast('inviteDeclined');
                }, function(data) {
                    alert(JSON.stringify(data));
                });
            },
            send: function(data, inviteSentSuccess, inviteSentFailure) {
                drupal.post(drupal.services.url('invites.json'), data, function(data) {
                    console.log('sent invite with id ');
                    console.log(data);
                    $rootScope.$broadcast('inviteSent');
                    inviteSentSuccess(data);
                }, function(data, status) {
                    alert('falied to sebd invite');
                    inviteSentFailure(data);
                });
            },
            cancel: function(id) {
                drupal.delete(drupal.services.url('invites/' + id + '.json'), function(data) {
                    console.log('cancelled invite with id ' + id);
                    console.log(data);
                    $rootScope.$broadcast('inviteCancelled');
                }, function(data, status) {
                    alert('falied to cancel invite');
                });
            },
            retrieve: function(options) {
                drupal.entity.index('invites', {
                    success: function(data) {
                        self.invites.data = data;
                        console.log(data);
                        console.log('retrievied invites');
                        $rootScope.$broadcast('invitesUpdated');
                        if (options.success) {
                            options.success(data);
                        }
                    },
                    failure: function(data) {
                        if (options.failure) {
                            options.failure(data);
                        }
                    }
                });

            },
        },
    }
    return self;
})