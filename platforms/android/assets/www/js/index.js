(function() {
    'use strict';

    angular.module('app', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $compileProvider) {

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|javascript):/);

        $stateProvider

        .state('dashboard',{
            url: '/',
            templateUrl: 'lista.html',
            controller: function($scope, $rootScope, LS){

                $rootScope.page = 'Lista de códigos';

                $scope.lista = JSON.parse(LS.getData());

                if ($scope.lista == null) $scope.lista = [];

                console.log($scope.lista);

                $scope.capture = function() {

                    cordova.plugins.barcodeScanner.scan(
                        function (result) {

                            if ($scope.lista.indexOf(result.text) == -1) {

                                $scope.lista.push(result.text);
                                LS.setData($scope.lista);

                                $scope.$digest($scope.lista);
                            }
                        },
                        function (error) {
                            alert("Scanning failed: " + error);
                        },
                        {
                            preferFrontCamera : false, // iOS and Android
                            showFlipCameraButton : true, // iOS and Android
                            showTorchButton : true, // iOS and Android
                            torchOn: true, // Android, launch with the torch switched on (if available)
                            saveHistory: true, // Android, save scan history (default false)
                            prompt : "Deixe o codigo de barras na area de scanner", // Android
                            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                        }
                    );
                }

                $scope.remove = function (val){

                    // Procura o item e remove
                    $scope.lista.splice($scope.lista.indexOf(val),1);
                }
            }
        })

        $urlRouterProvider.otherwise('/');
    })

    .factory("LS", function($window, $rootScope) {
        return {
            setData: function(val) {
                console.log(val);
                $window.localStorage && $window.localStorage.setItem('lista', JSON.stringify(val));
                return this;
            },
            getData: function() {
                return $window.localStorage && $window.localStorage.getItem('lista');
            },
        };
    });
})();