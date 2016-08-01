/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('stock_product',{
    
        
        stockProductPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'stock_product_pkid'
        },
        
        stockInfoPkid : {
            
            type : DataType.STRING,
            field : 'stock_info_pkid'
        },
        
        stockPrice : {
            
            type : DataType.FLOAT,
            field : 'stock_price'
        },
        
        stockAmount : {
            
            type : DataType.FLOAT,
            field : 'stock_amount'
        },
        
        stockSum : {
            
            type : DataType.FLOAT,
            field : 'stock_sum'
        },
        
        stockUrl : {
            
            type : DataType.STRING,
            field : 'stock_url'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}