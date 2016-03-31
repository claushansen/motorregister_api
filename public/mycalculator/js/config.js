(function() {
angular
    .module('mycalculator')
    .constant('appConfig',{
        //apiPath:'http://localhost:3000'
        apiPath:''
    })
    .config(function($routeProvider,$locationProvider) {

        $routeProvider
            .when("/", {
                redirectTo: "/nocalculator"
            })
            .when("/nocalculator", {
                templateUrl: "views/calculator/nocalculator.view.html",
                controller: "CalculatorController"
            })
            .when("/calculator/:calcid", {
                templateUrl: "views/calculator/calculator.view.html",
                controller: "CalculatorController"
            })
            .otherwise({
                redirectTo: "/nocalculator"
            });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);

    });
})();

