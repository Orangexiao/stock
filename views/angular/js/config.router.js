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
                .state('app.userInfo', {
                    url: '/userInfo',
                    templateUrl: '/goToUserInfo.do',
                    resolve: load([
                        'ui.select', 'js/controllers/select.js',
                        'js/services/UserInfoService.js',
                        'js/services/AddressInfoService.js',
                        'js/services/ChildInfoService.js',
                        'js/controllers/UserInfoController.js',
                        'js/controllers/ChildInfoController.js',
                        'js/controllers/AddressInfoController.js',
                        'js/services/DictClsService.js',
                        'js/services/RegionInfoService.js',
                        'js/controllers/PayDetailController.js',
                        'js/services/PayDetailService.js'
                    ])
                })
                //.state('app.addressInfo', {
                //    url: '/addressInfo',
                //    templateUrl: '/goToAddressInfo.do'
                //})
                //.state('app.childInfo', {
                //    url: '/childInfo',
                //    templateUrl: '/goToChildInfo.do'
                //})
                //.state('app.productInfo', {
                //    url: '/productInfo',
                //    templateUrl: '/goToProductInfo.do'
                //})
                //.state('app.productPicInfo', {
                //    url: '/productPicInfo',
                //    templateUrl: '/goToProductPicInfo.do'
                //})
                .state('app.orderInfo', {
                    url: '/orderInfo',
                    templateUrl: '/goToOrderInfo.do',
                    resolve: load([
                        'ui.select',
                        'js/controllers/select.js',
                        'js/controllers/OrderInfoController.js',
                        'js/services/OrderInfoService.js',
                        'js/services/UserInfoService.js',
                        'js/services/DictClsService.js',
                        'js/services/PlanInfoService.js',
                        'js/services/PaymentInfoService.js',
                        'js/controllers/PaymentInfoController.js',
                        'js/services/OperatorInfoService.js'
                    ])
                })
                //.state('app.orderProduct', {
                //    url: '/orderProduct',
                //    templateUrl: '/goToOrderProduct.do'
                //})
                //.state('app.photoInfo', {
                //    url: '/photoInfo',
                //    templateUrl: '/goToPhotoInfo.do'
                //})
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
                .state('app.otherPayment', {
                    url: '/otherPayment',
                    templateUrl: '/goToOtherPayment.do',
                    resolve: load([
                        'ui.select',
                        'js/controllers/OtherPaymentController.js',
                        'js/services/OtherPaymentService.js',
                        'js/services/DictClsService.js',
                        'js/services/OperatorInfoService.js'
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
                })
                .state('app.planInfo', {
                    url: '/planInfo',
                    templateUrl: '/goToPlanInfo.do',
                    resolve: load([
                        'js/controllers/PlanInfoController.js',
                        'js/services/PlanInfoService.js',
                        'textAngular'
                    ])
                });

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
