/**
 * Created by xiaohongju on 15/9/27.
 */
app.directive('validator',['$http','validatorService','$compile','StringService',function($http,validatorService,$compile,StringService){
    return {
        restrict : 'A',
        replace : false,
        transclude : true,
        require: '?ngModel',
        link : function(scope,elements,attrs,ctrl){
            if(attrs.validator){
                var vTypeArr = attrs.validator.split(',');
                angular.forEach(vTypeArr,function(i,n){
                    scope['is'+ elements[0].id + i] = false;
                    ctrl.$validators[i] = function(modelValue, viewValue) {
                        if(validatorService[i]){
                            scope['is'+ StringService.fstCharToUpper(elements[0].id) + StringService.fstCharToUpper(i)] = validatorService[i](viewValue);
                            scope[elements[0].id + 'VdMessage'] = validatorService.getMessage(i);
                            return validatorService[i](viewValue);
                        }else{
                            console.log('找不到对应的验证条件');
                        }
                    };
                })

            }
            attrs.$observe('validator', function() {
                ctrl.$validate();
            });
        }

    }
}])