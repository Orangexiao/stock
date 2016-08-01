/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('pattern_info',{
    
        
        patternInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'pattern_info_pkid'
        },
        
        productInfoPkid : {
            
            type : DataType.STRING,
            field : 'product_info_pkid'
        },
        
        patternName : {
            
            type : DataType.STRING,
            field : 'pattern_name'
        },
        
        patternId : {
            
            type : DataType.STRING,
            field : 'pattern_id'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}