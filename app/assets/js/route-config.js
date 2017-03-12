(function() {
    'use strict';
    angular
        .module('adler.cv')
        .config(config);

    function config($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'assets/partials/home.html'
            ,controller: 'HomeController as cv'
        });

        $routeProvider.otherwise({ redirectTo: '/home' });
    }
})();