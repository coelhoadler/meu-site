(function() {
    'use strict';

    angular
        .module('api.service', [])
        .factory('HomeService', HomeService);

    /* @ngInject */
    function HomeService($http) {
        var _getProfile = function() {
            const API_URL = 'https://meu-site-5f4d8.firebaseio.com/.json';
            return $http.get(API_URL);
        }

        return {
            getProfile : _getProfile
        }
    }

    HomeService.$inject = ['$http'];

})();