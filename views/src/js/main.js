'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', '$state', 'toaster','FunctionInfoService','ErrorService',
        function ($scope, $rootScope, $translate, $localStorage, $window, $state, toaster,FunctionInfoService,ErrorService) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            $scope.functionList = [];

            $scope.operator = $rootScope.operator;

            (function(){

            })();

            // config
            $scope.app = {
                name: '小明同学',
                version: '2.0.2',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: true,
                    asideDock: true,
                    container: false,
                    login : false
                }
            }

            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // for box layout, add background image
                $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.lang = {isopen: false};
            $scope.langs = {en: 'English', de_DE: 'German', it_IT: 'Italian'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            //
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name !== 'access.signin') {
                    var token = $localStorage.token;
                    if (!token) {
                        event.preventDefault();
                        $state.go('access.signin');
                    }else{
                        if($scope.functionList.length ===0){
                            $scope.functionList = [];
                            FunctionInfoService.getByOperator().then(function(functionList){
                                $scope.functionList = functionList;
                            })
                        }
                    }
                }else{
                    $rootScope.$broadcast('switchToLogin');
                }

                if(fromState.name === 'access.signin'){
                    $rootScope.$broadcast('leaveLogin')
                }
            })

            $scope.$on('errorOccur', function (event, data) {
                console.log(data);
                var toasterObj = {
                    type: 'error',
                    title: '异常',
                    text: data
                };
                toaster.pop(toasterObj.type, toasterObj.title, toasterObj.text);

            })

            $scope.$on('switchToLogin',function(event,data){
                $scope.app.settings.login = true;
            });

            $scope.$on('leaveLogin',function(event,data){
                $scope.app.settings.login = false;
            });

            $scope.$on('loginTimeout',function(){
                $state.go('access.signin');
            })

            //$scope.$on('loginSuccess',function(event,data){
            //    FunctionInfoService.getByOperator().then(function(functionList){
            //        console.log(functionList);
            //    })
            //});

            $scope.logout = function () {
                delete $localStorage.token;
                $scope.functionList = [];
                $state.go('access.signin');
            }
        }]);
