'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
    .config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
        function ($stateProvider, $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
            var layout = "/common/goToApp.do";
            if (window.location.href.indexOf("material") > 0) {
                layout = "tpl/blocks/material.layout.html";
                $urlRouterProvider
                    .otherwise('/app/dashboard-v3');
            } else {
                $urlRouterProvider
                    .otherwise('/access/signin');
            }

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: layout
                })
                .state('app.dashboard-v1', {
                    url: '/dashboard-v1',
                    templateUrl: '/common/goToIndex.do',
                    resolve: load(['js/controllers/chart.js'])
                })
                .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                .state('access.signin', {
                    url: '/signin',
                    templateUrl: 'goToSignIn.do',
                    resolve: load(['js/controllers/signin.js'])
                })
                .state('app.operatorInfo', {
                    url: '/operatorInfo',
                    templateUrl: '/goToOperatorInfo.do',
                    resolve: load([
                        'ui.select',
                        'js/controllers/select.js',
                        'js/controllers/OperatorInfoController.js',
                        'js/services/OperatorInfoService.js',
                        'js/services/DictClsService.js',
                        'js/services/RoleInfoService.js'
                    ])
                })
                .state('app.functionInfo', {
                    url: '/functionInfo',
                    templateUrl: '/goToFunctionInfo.do',
                    resolve: load([
                        'ui.select',
                        'js/controllers/FunctionInfoController.js',
                        'js/services/FunctionInfoService.js',
                        'js/services/DictClsService.js'
                    ])
                })
                .state('app.dictCls', {
                    url: '/dictCls',
                    templateUrl: '/goToDictCls.do',
                    resolve: load([
                        'js/controllers/DictClsController.js',
                        'js/services/DictClsService.js',
                        'js/services/DictOptService.js',
                        'js/controllers/DictOptController.js'
                    ])
                })
                .state('app.dictOpt', {
                    url: '/dictOpt',
                    templateUrl: '/goToDictOpt.do'
                })
                .state('app.serialInfo', {
                    url: '/serialInfo',
                    templateUrl: '/goToSerialInfo.do',
                    resolve: load([
                        'js/controllers/SerialInfoController.js',
                        'js/services/SerialInfoService.js'
                    ])
                })
                .state('app.roleInfo', {
                    url: '/roleInfo',
                    templateUrl: '/goToRoleInfo.do',
                    resolve: load([
                        'js/controllers/RoleInfoController.js',
                        'js/services/RoleInfoService.js',
                        'ui.select',
                        'js/services/DictClsService.js',
                        'js/services/FunctionInfoService.js'
                    ])
                }).state('app.productInfo', {
                    url: '/productInfo',
                    templateUrl: '/goToProductInfo.do',
                    resolve: load([
                        'xeditable',
                        'js/controllers/xeditable.js'
                    ])
                })
                .state('app.shopInfo', {
                    url: '/shopInfo',
                    templateUrl: '/goToShopInfo.do'
                })
                .state('app.shopProductInfo', {
                    url: '/shopProductInfo',
                    templateUrl: '/goToShopProductInfo.do'
                })
                .state('app.stockInfo', {
                    url: '/stockInfo',
                    templateUrl: '/goToStockInfo.do'
                })
                .state('app.stockProduct', {
                    url: '/stockProduct',
                    templateUrl: '/goToStockProduct.do'
                })
                .state('app.orderInfo', {
                    url: '/orderInfo',
                    templateUrl: '/goToOrderInfo.do'
                })
                .state('app.orderProduct', {
                    url: '/orderProduct',
                    templateUrl: '/goToOrderProduct.do'
                })
                .state('app.patternInfo', {
                    url: '/patternInfo',
                    templateUrl: '/goToPatternInfo.do'
                })


            function load(srcs, callback) {
                return {
                    deps: ['$ocLazyLoad', '$q',
                        function ($ocLazyLoad, $q) {
                            var deferred = $q.defer();
                            var promise = false;
                            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                            if (!promise) {
                                promise = deferred.promise;
                            }
                            angular.forEach(srcs, function (src) {
                                console.log(src);
                                promise = promise.then(function () {
                                    if (JQ_CONFIG[src]) {
                                        return $ocLazyLoad.load(JQ_CONFIG[src]);
                                    }
                                    angular.forEach(MODULE_CONFIG, function (module) {
                                        if (module.name == src) {
                                            name = module.name;
                                        } else {
                                            name = src;
                                        }
                                    });
                                    return $ocLazyLoad.load(name);
                                });
                            });
                            deferred.resolve();
                            return callback ? promise.then(function () {
                                return callback();
                            }) : promise;
                        }]
                }
            }


        }
    ]
);
