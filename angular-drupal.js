angular.module('angular.drupal', [])



// Drupal factory
.factory('drupal', function($rootScope, $http) {
    var self = {
        site: {
            root: null,
            api: null
        },
        api: { // Drupal services api endpoints
            url: null,
            connect: 'system/connect.json',
            token: 'user/token.json',
            login: 'user/login.json',
            logout: 'user/logout.json',
            register: 'user/register.json',
            user_register: 'user/register.json',
            push: 'push_notifications',
            user: 'user',
            file: 'file',
        },
        session: {
            csrf: null,
        },
        loggedIn: false,
        // Drupal specific settings
        settings: {
            // Api base url.
            api: null,
            // Google cloud messaging.
            gcm: {
                senderID: null
            },
            cache: {

            }
        },
        // Predefined resource paths.
        paths: {
            url: null,
            system_connect: 'system/connect.json',
            user_token: 'user/token.json',
            login: 'user/login.json',
            logout: 'user/logout.json',
            register: 'user/register.json',
            user_register: 'user/register.json',
            push: 'push_notifications',
            user: 'user',
            file: 'file',
        },
        init: function(options) {
            self.paths.api = options.api;
            // Check everything is setup properly
            if (options.api == null) {
                console.log('Please check root url is defined.');
                return false;
            } else {
                self.paths.api = options.api;
                return true;
            }
            return true;
        },

        // User operations.
        user: {
            // The currently logged in user profile.
            profile: {
                data: null,
                retrieve: function(options) {

                    console.log('syncing');
                    console.log(self.user.profile.data);
                    self.user.retrieve(self.user.profile.data.uid, {
                        success: function(data) {
                            console.log(data);
                            self.user.profile.save(data);
                            $rootScope.$broadcast('userProfileUpdated');
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
                update: function(fields, options) {
                    console.log(fields);
                    fields.uid = self.user.profile.data.uid;
                    self.entity.update('user', fields, {
                        success: function(data) {
                            angular.extend(self.user.profile.data, data);
                            localStorage.setItem("profile", JSON.stringify(self.user.profile.data));
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
                save: function(data) {
                    self.user.profile.data = data;
                    localStorage.setItem("profile", JSON.stringify(self.user.profile.data));
                },
            },
            // Request a new csrf token.
            token: function(options) {
                self.services.post(self.services.url(self.paths.user_token), {}, {
                    success: function(data) {
                        self.session.csrf = data.token;
                        localStorage.setItem("csrf", self.session.csrf);
                        if (options.success) {
                            options.success(data);
                        };
                    },
                    failure: function(data) {
                        alert('fa callback');
                        if (options.failure) {
                            options.failure(data);
                        };
                    }
                });
            },
            connect: function(options) {
                self.user.system_connect(options);
            },
            init: function(options) {
                // Check local storage for any saved details
                var profile = localStorage.getItem("profile");
                var csrf = localStorage.getItem("csrf");

                if (profile && csrf) {
                    self.user.profile.data = JSON.parse(profile);
                    self.session.csrf = csrf;

                    console.log('got csrf and profile');
                    self.user.connect({
                        success: function(data) {
                            if (data.user.uid != self.user.profile.data.uid) {
                                localStorage.removeItem('csrf');
                                localStorage.removeItem('profile');
                                localStorage.removeItem('friends');
                                self.user.init(options);
                            } else {
                                if (options.success) {
                                    options.success(data);
                                };
                            }
                            console.log(data.user.uid);
                            console.log(self.user.profile.data.uid);
                        },
                        failure: function(data) {
                            console.log('failed connect');
                            localStorage.removeItem('csrf');
                            localStorage.removeItem('profile');
                            localStorage.removeItem('friends');
                            self.user.init(options);
                            console.log(data);
                        }
                    });
                } else {
                    self.user.token({
                        success: function(data) {
                            self.user.connect({
                                success: function(data) {
                                    self.user.profile.data = data.user;
                                    // If the user id is 0 we are logged out
                                    if (typeof(self.user.profile.data.uid) == 'undefined' || self.user.profile.data.uid == 0) {
                                        // Set the global logged in flag to false.
                                        $rootScope.loggedIn = self.loggedIn = false;
                                        if (options.failure) {
                                            options.failure(data);
                                        };
                                    } else {
                                        // Set the global logged in flag to true.
                                        $rootScope.loggedIn = self.loggedIn = true;

                                        if (options.success) {
                                            options.success(data);
                                        };
                                        // Go get the user profile for the logged in use.
                                        self.user.profile.retrieve({

                                        });
                                    }
                                },
                                failure: function(data) {

                                }
                            });
                        },
                        failure: function(data) {

                        }
                    });
                }

            },
            // Establish a connection with drupal
            system_connect: function(options) {
                self.services.post(self.services.url(self.paths.system_connect), {}, options);
            },
            load: function(uid, options) {
                self.user.retrieve(uid, options);
            },
            retrieve: function(uid, options) {
                self.entity.retrieve('user', uid, options);
            },
            update: function(account, options) {
                console.log(account);
                self.entity.update('user', account, options);
            },
            delete: function(uid) {
                self.entity.delete('user', uid, options);
            },
            create: function(account, options) {
                self.entity.create('user', account, options);
            },
            register: function(account, options) {
                self.services.post(self.services.url(self.paths.user_register), account, {
                    success: function(data) {
                        $rootScope.$broadcast('userRegisterSuccess');
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
            login: function(username, password, options) {
                self.services.post(self.services.url(self.paths.login), {
                    'username': username,
                    'password': password
                }, {
                    success: function(data) {
                        self.user.profile.data = data.user;
                        self.user.init({
                            success: function() {
                                $rootScope.$broadcast('userLoginSuccess');
                                if (options.success) {
                                    options.success(data);
                                };
                            },
                            failure: function() {
                                if (options.failure) {
                                    options.failure(data);
                                };
                            }
                        });

                    },
                    failure: function(data) {
                        if (options.failure) {
                            options.failure(data);
                        };
                    }
                });
            },
            logout: function(options) {
                self.services.post(self.services.url(self.paths.logout), {}, {
                    success: function(data) {
                        localStorage.removeItem('csrf');
                        localStorage.removeItem('profile');
                        localStorage.removeItem('friends');
                        $rootScope.$broadcast('userLogoutSuccess');
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
        },
        entity: {
            keys: {
                comment: 'cid',
                file: 'fid',
                node: 'nid',
                taxonomy_term: 'tid',
                taxonomy_vocabulary: 'vid',
                user: 'uid',
                groups: 'group_id'
            },
            load: function(entity_type, entity_id, options) {
                self.entity.retrieve(entity_type, entity_id, options);
            },
            create: function(entity_type, entity, options) {
                self.services.post(self.services.url(entity_type + '.json'), entity, options);
            },
            retrieve: function(entity_type, entity_id, options) {
                self.services.get(self.services.url(entity_type + '/' + entity_id + '.json'), options);
            },
            update: function(entity_type, entity, options) {
                self.services.put(self.services.url(entity_type + '/' + entity[self.entity.keys[entity_type]] + '.json'), entity, options);
            },
            index: function(entity_type, query, options) {

                self.services.get(self.services.url(entity_type + '.json'), query, options);
            },
            save: function(entity_type, entity, options) {
                if (entity[self.entity.keys[entity_type]]) {
                    self.entity.update(entity_type, entity, options);
                } else {
                    self.entity.create(entity_type, entity, options);
                }
            },
            delete: function(entity_type, entity_id, options) {
                self.services.delete(self.services.url(entity_type + '/' + entity_id + '.json'), options);
            },
        },
        node: {
            load: function(nid, options) {
                self.entity.load('node', nid, options);
            },
            save: function(node, options) {
                self.entity.save('node', node, options);
            },
            create: function(node, options) {
                self.entity.create('node', node, options);
            },
            retrieve: function(node, options) {
                self.entity.retrieve('node', node, options);
            },
            update: function(node, options) {
                self.entity.update('node', node, options);
            },
            delete: function(nid, options) {
                self.entity.delete('node', nid, options);
            },
            index: function(query, options) {
                self.entity.index('node', query, options);
            },
        },
        file: {
            load: function(fid, options) {
                self.entity.load('file', fid, options);
            },
            save: function(file, options) {
                self.entity.save('file', file, options);
            },
            create: function(file, options) {
                self.entity.create('file', file, options);
            },
            retrieve: function(fid) {
                self.entity.retrieve('file', fid, options);
            },
            update: function(file, options) {
                self.entity.update('file', file, options);
            },
            delete: function(fid, options) {
                self.entity.delete('file', fid, options);
            },
        },
        taxonomy: {
            term: {
                load: function(tid, options) {
                    self.entity.load('taxonomy_term', tid, options);
                },
                save: function(taxonomy_term, options) {
                    self.entity.save('taxonomy_term', taxonomy_term, options);
                },
                create: function(taxonomy_term, options) {
                    self.entity.create('taxonomy_term', taxonomy_term, options);
                },
                retrieve: function(tid, options) {
                    self.entity.retrieve('taxonomy_term', tid, options);
                },
                update: function(taxonomy_term, options) {
                    self.entity.update('taxonomy_term', taxonomy_term, options);
                },
                delete: function(tid, options) {
                    self.entity.delete('taxonomy_term', tid, options);
                },
                index: function(query, options) {
                    self.entity.index('taxonomy_term', query, options);
                }
            },
            vocabulary: {
                load: function(vid, options) {
                    self.entity.load('taxonomy_vocabulary', vid, options);
                },
                save: function(taxonomy_vocabulary, options) {
                    self.entity.save('taxonomy_vocabulary', taxonomy_vocabulary, options);
                },
                create: function(taxonomy_vocabulary, options) {
                    self.entity.create('taxonomy_vocabulary', taxonomy_vocabulary, options);
                },
                retrieve: function(vid, options) {
                    self.entity.retrieve('taxonomy_vocabulary', vid, options);
                },
                update: function(taxonomy_vocabulary, options) {
                    self.entity.update('taxonomy_vocabulary', taxonomy_vocabulary, options);
                },
                delete: function(vid, options) {
                    self.entity.delete('taxonomy_vocabulary', vid, options);
                },
                index: function(query, options) {
                    self.entity.index('taxonomy_vocabulary', query, options);
                }
            },
        },
        comment: {
            create: function(comment, options) {
                self.entity.create('comment', comment, options);
            },
            retrieve: function(ids, options) {
                self.entity.retrieve('comment', ids, options);
            },
            update: function(comment, options) {
                self.entity.update('comment', comment, options);
            },
            delete: function(cid, options) {
                self.entity.delete('comment', cid, options);
            },
            index: function(query, options) {
                self.entity.index('comment', query, options);
            },
        },
        services: {
            url: function(endpoint) {
                // Return the full url to the services api endpoint.
                return self.paths.api + endpoint;
            },
            config: function() {
                var config = {
                    headers: {}
                }
                if (self.session.csrf != null) {
                    config.headers['X-CSRF-Token'] = self.session.csrf
                }
                return config;
            },
            post: function(url, data, options) {
                // Post token to drupal
                $http.post(url, data, self.services.config()).
                success(function(data, status, headers, config) {
                    if (options.success) {
                        options.success(data);
                    };
                }).error(function(data, status, headers, config) {
                    if (options.failure) {
                        options.failure(data);
                    };
                });
            },
            put: function(url, data, options) {
                $http.put(url, data, self.services.config()).
                success(function(data, status, headers, config) {
                    if (options.success) {
                        options.success(data);
                    };
                }).error(function(data, status, headers, config) {
                    if (options.failure) {
                        options.failure(data);
                    };
                });
            },
            get: function(url, options) {
                $http.get(url, self.services.config()).
                success(function(data, status, headers, config) {
                    if (options.success) {
                        options.success(data);
                    };
                }).error(function(data, status, headers, config) {
                    if (options.failure) {
                        options.failure(data);
                    };
                });
            },
            delete: function(url, options) {
                $http.delete(url, self.services.config()).
                success(function(data, status, headers, config) {
                    if (options.success) {
                        options.success(data);
                    };
                }).error(function(data, status, headers, config) {
                    if (options.failure) {
                        options.failure(data);
                    };
                });
            },
        }


    }
    return self;
})