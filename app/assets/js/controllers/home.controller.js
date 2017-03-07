(function() {
    'use strict';
    angular
        .module('adler.cv')
        .controller('HomeController', HomeController);

    function HomeController(HomeService) {
        HomeService.getProfile().then(function(response) {
            if (response.status === 200) {
                vm.data = response.data;
            } else {
                console.error(response.status + ' - ' + response.statusText);
            }
        }, function(error) {
            console.error(error);
        });

        var vm = this;
        vm.loader = false;
        vm.data = {};
    }

    HomeController.$inject = ['HomeService'];

})();