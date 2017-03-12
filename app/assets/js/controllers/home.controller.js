(function() {
    'use strict';
    angular
        .module('adler.cv')
        .controller('HomeController', HomeController);
        
    /* @ngInject */
    function HomeController(HomeService) {

        var vm = this;
        vm.loader = true;
        vm.data = {};
        vm.currentYear = new Date().getFullYear();

        var currilumObject = window.localStorage.getItem('curriculumObject');
        if (currilumObject) {
            vm.data = JSON.parse(currilumObject);
            vm.loader = false;
        } else {
            HomeService.getProfile().then(function(response) {
                if (response.status === 200) {
                    response.data.experience.company.reverse();
                    vm.data = response.data;
                    vm.loader = false;
                    window.localStorage.setItem('curriculumObject', JSON.stringify(response.data));
                } else {
                    console.error(response.status + ' - ' + response.statusText);
                }
            }, function(error) {
                console.error(error);
            });
        }

        // Verify if the curretn value is a object
        vm.isObject = function(value) {
            return angular.isObject(value);
        }
    }

    HomeController.$inject = ['HomeService'];
})();