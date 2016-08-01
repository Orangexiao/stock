/**
 * Created by xiaohongju on 15/12/15.
 */


function processTimezone(v){
    var year = v.getFullYear();
    var month = v.getMonth() + 1;
    var date = v.getDate();
    var hour = v.getHours();
    var min = v.getMinutes();
    var sec = v.getSeconds();
    var result = year + '-' + month + '-' + date + ' ' + hour + ':' + min +':' + sec
    return result;
}

Date.prototype.toJSON = function(){
    return processTimezone(this);
}
