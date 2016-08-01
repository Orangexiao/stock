/**
 * Created by xiaohongju on 16/2/8.
 */

var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

var SqlUtil = function(partName){
    var self = this;
    var sqlFileName = partName || '../sql/sql.xml';
    self.sqlXmlString =  fs.readFileSync('../sql/sql.xml','utf-8');
    //根据SQLID获取SQL语句
    this.getSql = function(id){
        if(id){
            var sqlXml = new DOMParser().parseFromString(self.sqlXmlString)
            //console.log(sqlXml);
            var sql = sqlXml.getElementById(id).childNodes[1].data;
            if(sql){
                return sql;
            }else{
                throw new Error('没有找到id为' + id + '的SQL');
            }

        }
    }
}

module.exports = SqlUtil;