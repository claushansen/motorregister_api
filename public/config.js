(function() {
    angular
        .module('MDRAPI')
        .config(function($routeProvider){
            $routeProvider
                .when("/",{
                    templateUrl:"partials/home/home.view.html",
                    controller: "HomeController",
                    resolve: {
                        loggedin: checkCurrentUser
                    }
                })
                .when("/dashboard",{
                    templateUrl:"partials/dashboard/dashboard.view.html",
                    controller: "DashboardController",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/login",{
                    templateUrl:"partials/login/login.view.html",
                    controller: "LoginController"
                })
                .when("/profile",{
                    templateUrl:"partials/profile/profile.view.html",
                    controller: "ProfileController",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/admin",{
                    templateUrl:"partials/admin/admin.view.html",
                    controller: "AdminController",
                    resolve: {
                        loggedin: checkAdmin
                    }

                })
                .when("/admin/users",{
                    templateUrl:"partials/admin.users/admin.users.view.html",
                    controller: "AdminUsersController",
                    resolve: {
                        loggedin: checkAdmin
                    }

                })
                .otherwise({
                    redirectTo:"/"
                })
        })
        .constant('treeConfig', {
        treeClass: 'angular-ui-tree',
        emptyTreeClass: 'angular-ui-tree-empty',
        hiddenClass: 'angular-ui-tree-hidden',
        nodesClass: 'angular-ui-tree-nodes',
        nodeClass: 'angular-ui-tree-node',
        handleClass: 'angular-ui-tree-handle',
        placeholderClass: 'angular-ui-tree-placeholder',
        dragClass: 'angular-ui-tree-drag',
        dragThreshold: 3,
        levelThreshold: 30,
        defaultCollapsed: false
    });

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                if(user.roles.indexOf('admin') > -1 ){
                    $rootScope.currentUser.isadmin = true;
                }
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0' && user.roles.indexOf('admin') != -1)
            {
                $rootScope.currentUser = user;
                $rootScope.currentUser.isadmin = true;

                deferred.resolve();
            }
            // User is Not Admin
            else
            {
                $rootScope.errorMessage = 'You do not have access to this resource.';
                deferred.reject();
                $location.url('/');
            }
        });

        return deferred.promise;
    };

    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                if(user.roles.indexOf('admin') > -1 ){
                    $rootScope.currentUser.isadmin = true;
                }

            }
            deferred.resolve();
        });
        $rootScope.errorMessage = 'test';

        return deferred.promise;
    };


})();
