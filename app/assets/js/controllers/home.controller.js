(function() {
    'use strict';
    angular
        .module('adler.cv')
        .controller('HomeController', HomeController);
    
    /* @ngInject */
    function HomeController(HomeService) {
        HomeService.getProfile().then(function(response) {
            if (response.status === 200) {
                response.data.experience.company.reverse();
                vm.data = response.data;
                vm.loader = false;
            } else {
                console.error(response.status + ' - ' + response.statusText);
            }
        }, function(error) {
            console.error(error);
        });

        var vm = this;
        vm.loader = true;
        vm.data = {};
        vm.currentYear = new Date().getFullYear();

        // Verify if the value is a object
        vm.isObject = value => {
            return angular.isObject(value);
        }
    }

    HomeController.$inject = ['HomeService'];

})();