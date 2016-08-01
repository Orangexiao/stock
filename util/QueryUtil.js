/**
 * Created by xiaohongju on 16/3/4.
 */
var QueryUtil = function(sequelize){
    var self = this;
    this.sequelize = sequelize;
    var q = require('q');
    this.queryByPage = function(sqlString,params){
        return sequelize.query(sqlString,params).then(function(queryResult){
            return sequelize.query(self.processSqlString(sqlString),params).then(function(count){
                return q.fcall(function(){
                    return {
                        count : parseInt(count[0].count),
                        rows : queryResult
                    }
                })
            })
        })

    }

    this.processSqlString = function(sqlString){
        var result = 'select count(*) from (' + sqlString + ') tt'
        return result;
    }
}

module.exports = QueryUtil;