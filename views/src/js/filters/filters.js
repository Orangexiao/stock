/**
 * Created by xiaohongju on 15/12/13.
 */
'use strict';

/* Filters */
// need load the moment.js to use this filter.
angular.module('app')
    .filter('dateFormat', function () {
        return function (dateString) {
            if (dateString) {
                var date = new Date(dateString);
                if (date.getFullYear()) {
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    return year + '-' + month + '-' + day;
                } else {
                    return dateString;
                }
                console.log(date + ' ' + dateString);

            } else {
                return '-';
            }
        }
    });

angular.module('app')
    .filter('percentage', function () {
        return function (data) {
            var per = parseFloat(data);
            if (isNaN(per)) {
                return '-'
            } else {
                per = (per * 100).toFixed(2);
                per = per + '%';
                return per;
            }
        }
    });