(function() {
    angular
        .module('MDRAPI')
        .constant('appConfig',{
            apiPath:'http://localhost:3000'
        })
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
                .when("/calculator/new",{
                    templateUrl:"partials/calculator/calculator.view.html",
                    controller: "CalculatorController",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/calculator/edit/:id",{
                    templateUrl:"partials/calculator/calculator.view.html",
                    controller: "CalculatorController",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/login",{
                    templateUrl:"partials/login/login.view.html",
                    controller: "LoginController"
                })
                .when("/register",{
                    templateUrl:"partials/register/register.view.html",
                    controller: "RegisterController"
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
        });

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, messageCenterService)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
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
                messageCenterService.add('danger', 'Log venlist ind', {status: messageCenterService.status.next});
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope, messageCenterService)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
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
                messageCenterService.add('danger', 'Du har ikke adgang til denne side', {status: messageCenterService.status.next});
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


        return deferred.promise;
    };


})();
