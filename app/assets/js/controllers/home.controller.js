(function() {
    'use strict';
    angular
        .module('adler.cv')
        .controller('HomeController', HomeController);

    function HomeController(HomeService) {
        HomeService.getProfile().then(function(response) {
            if (response.status === 200) {
                console.log('resposta', response);
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
    }

    HomeController.$inject = ['HomeService'];

})();