/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('stock_info',{
    
        
        stockInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'stock_info_pkid'
        },
        
        patternInfoPkid : {
            
            type : DataType.STRING,
            field : 'pattern_info_pkid'
        },
        
        stockNo : {
            
            type : DataType.STRING,
            field : 'stock_no'
        },
        
        stockDate : {
            
            type : DataType.DATE,
            field : 'stock_date'
        },
        
        expressTypeCode : {
            
            type : DataType.STRING,
            field : 'express_type_code'
        },
        
        expressType : {
            
            type : DataType.STRING,
            field : 'express_type'
        },
        
        expressNo : {
            
            type : DataType.STRING,
            field : 'express_no'
        },
        
        stockStatus : {
            
            type : DataType.STRING,
            field : 'stock_status'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}