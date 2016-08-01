/**
 * Created by xiaohongju on 15/9/27.
 */
app.factory('StringService',['$rootScope','$q',function($rootScope,$q){
    return  {
        camelToUnderline : function(str){
            var result = "";
            for(var i=0;i<str.length;i++){
                if (/^[A-Z]+$/.test(str.charAt(i))){
                    result = result +'_'+ str.charAt(i).toLowerCase();
                }else{
                    result = result + str.charAt(i);
                }
            }
            return result;
        },
        underlineToCamel : function(str){
            var result = "";
            for(var i=0;i<word.length;i++){
                if(word.charAt(i)==='_'){
                    i++;
                    result = result + word.charAt(i).toUpperCase();
                }else{
                    result = result + word.charAt(i);
                }
            }
            return result;
        },
        fstCharToUpper : function(str){
            var result = "";
            result = str.charAt(0).toUpperCase() + str.substr(1,str.length);
            return result;
        }
    }
}])