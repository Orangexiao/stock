/**
 * Created by xiaohongju on 15/8/29.
 */

app.factory('operatorInfoService',['$rootScope','$q','$http',function($rootScope,$q,$http){
    return {
        queryByPage : function(){
            var deffered = $q.defer();
            $http({
                method : 'post',
                url : 'getOperatorInfoByPage.do'
            }).success(
                function(data, status, headers, config){
                    deffered.resolve(data);
                }
            ).error(
                function(data, status, headers, config){
                    deffered.reject(data);
                }
            );
            return deffered.promise;
        }
    }
}]);

//GRID相关Service
app.factory('gridService',['$rootScope','$window',function($rootScope,$window){
    return {
        getRowIndex : function(colName,value,rows){
            var result = null;
            angular.forEach(rows,function(row,index){
                if(row[colName]===value){
                    result = index;
                    return false;
                }
            });
            return result;
        },
        resizeHeight : function(){
            var height = (($window.innerHeight > 0) ? $window.innerHeight : $window.screen.height) - 1;
            return height;
        }
    }
}]);

app.factory('createDialog', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
    function ($document, $compile, $rootScope, $controller, $timeout) {

        var defaults = {
            id: null,
            template: null,
            templateUrl: null,
            title: '  ',
            backdrop: true,
            success: {label: '确定', fn: null},
            cancel: {label: '取消', fn: null},
            controller: null, //just like route controller declaration
            backdropClass: "modal-backdrop",
            backdropCancel: true,
            footerTemplate: null,
            modalClass: "modal",
            message : '',
            successBtn : true,
            cancelBtn : true,
            type : '1',
            width : 1000,
            data : {},
            css: {
                top: '1%',
                left: '15%',
                margin: '0 auto'
            }
        };
        var body = $document.find('body');
        $rootScope.maxZindex = 1050;

        return function Dialog(templateUrl/*optional*/, options, passedInLocals) {
            // Handle arguments if optional template isn't provided.
            if(angular.isObject(templateUrl)){
                passedInLocals = options;
                options = templateUrl;
            } else {
                options.templateUrl = templateUrl;
            }

            options = angular.extend({}, defaults, options); //options defined in constructor

            var key;
            var idAttr = options.id ? ' id="' + options.id + '" ' : '';
            var defaultFooter= '';
            var isBtnSuccess = options.successBtn || false;
            var isBtnCancel = options.cancelBtn || false;
            if(isBtnSuccess){
                defaultFooter = defaultFooter + '<button class="btn btn-info"  ng-click="$modalCancel()">{{$modalCancelLabel}}</button>';
            }

            if(isBtnCancel){
                defaultFooter = defaultFooter + '<button class="btn btn-primary" ng-disabled="!popupForm.$valid" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
            }

            var modalBody = (function(){
                if(options.template){
                    if(angular.isString(options.template)){
                        // Simple string template
                        return '<div class="modal-body popup">' + options.template + '</div>';
                    } else {
                        // jQuery/JQlite wrapped object
                        return '<div class="modal-body popup">' + options.template.html() + '</div>';
                    }
                } else if(options.templateUrl) {
                    // Template url
                    return '<div class="modal-body popup" ng-include="\'' + options.templateUrl + '\'"></div>'
                } else {
                    if(options.type){
                        //成功提示框
                        if(options.type==='1'){
                            options.footerTemplate = '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
                            return '<div class="alert alert-success">' + options.message + '</div>';
                            //错误提示框
                        }else if(options.type==='2'){
                            options.footerTemplate = '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
                            return '<div class="alert alert-danger">' + options.message + '</div>';
                            //警告提示框
                        }else if(options.type==='3'){
                            options.footerTemplate = '<button class="btn btn-info" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>' +
                                '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
                            return '<div class="alert alert-warning">' + options.message + '</div>';
                            //确认框
                        }else if(options.type==='4'){
                            options.footerTemplate = '<button class="btn btn-info" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>' +
                                '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
                            return '<div class="alert alert-info">' + options.message + '</div>';
                        }
                    }
                }
            })();
            var footerTemplate = '<div class="modal-footer">' +
                (options.footerTemplate || defaultFooter) +
                '</div>';
            //We don't have the scope we're gonna use yet, so just get a compile function for modal
            var modalEl = angular.element(

                '<div class="' + options.modalClass + ' fade"' + idAttr + ' style="display: block;z-index:' + ($rootScope.maxZindex + 20) + ';">' +
                '<ng-form name="popupForm" >' +
                '  <div class="modal-dialog" style="width:' + options.width + 'px">' +
                '    <div class="modal-content" novalidate>' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
                '        <span>{{$title}}</span>' +
                '      </div>' +
                modalBody +
                footerTemplate +
                '    </div>' +
                '  </div>' +
                '</div>'
                );

            for(key in options.css) {
                modalEl.css(key, options.css[key]);
            }
            var divHTML = "<div ";
            if(options.backdropCancel){
                divHTML+='ng-click="$modalCancel()" ';
            }
            divHTML += ('style=z-index:' + ($rootScope.maxZindex += 10));
            divHTML+=">";
            var backdropEl = angular.element(divHTML);
            backdropEl.addClass(options.backdropClass);
            backdropEl.addClass('fade in');

            var handleEscPressed = function (event) {
                if (event.keyCode === 27) {
                    scope.$modalCancel();
                }
            };

            var closeFn = function () {
                body.unbind('keydown', handleEscPressed);
                modalEl.remove();
                if (options.backdrop) {
                    backdropEl.remove();
                }
            };

            body.bind('keydown', handleEscPressed);

            var ctrl, locals,
                scope = options.scope || $rootScope.$new();

            scope.$title = options.title;
            scope.$modalClose = closeFn;
            scope.$modalCancel = function () {
                var callFn = options.cancel.fn || closeFn;
                callFn.call(this,scope);
                scope.$modalClose();
            };
            scope.$modalSuccess = function () {
                var callFn = options.success.fn || closeFn;
                var result =callFn.call(this,scope);
                console.log(result);
                scope.$modalClose();
            };
            scope.$modalSuccessLabel = options.success.label;
            scope.$modalCancelLabel = options.cancel.label;
            scope.transData = options.data;

            if (options.controller) {
                locals = angular.extend({$scope: scope}, passedInLocals);
                ctrl = $controller(options.controller, locals);
                // Yes, ngControllerController is not a typo
                modalEl.contents().data('$ngControllerController', ctrl);
            }

            $compile(modalEl)(scope);
            $compile(backdropEl)(scope);
            body.append(modalEl);
            if (options.backdrop) body.append(backdropEl);

            $timeout(function () {
                modalEl.addClass('in');
            }, 200);
        };
    }]);


app.factory('PageObjectService', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
    function ($document, $compile, $rootScope, $controller, $timeout) {
        var pageObject = function(){
            var self = this;
            this.totalItems = 0;
            this.pageSize = 30;
            this.currentPage = 1;
            this.firstRow = (this.currentPage - 1)*this.pageSize;
            this.lastRow = this.firstRow + this.pageSize;
            this.opts = {}
            this.data = null;

            this.setTotalItems = function(itemCount){
                self.totalItems = itemCount;
            }

            this.setPageSize = function(size){
                this.pageSize = size;
                self.recount();
            }

            this.setCurrentPage = function(cPage){
                self.currentPage = cPage;
                self.recount();
            }

            this.setData = function(data){
                self.data = data;
            }

            this.recount = function(){
                self.firstRow = (self.currentPage-1)*self.pageSize;
                self.lastRow = self.firstRow + self.pageSize;
            }
        }

        return {
            getPageObject : function(){
                return new pageObject();
            }
        }

    }]);
