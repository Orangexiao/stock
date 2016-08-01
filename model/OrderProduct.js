/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('order_product',{
    
        
        orderProductPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'order_product_pkid'
        },
        
        patternInfoPkid : {
            
            type : DataType.STRING,
            field : 'pattern_info_pkid'
        },
        
        orderInfoPkid : {
            
            type : DataType.STRING,
            field : 'order_info_pkid'
        },
        
        productPrice : {
            
            type : DataType.FLOAT,
            field : 'product_price'
        },
        
        productCount : {
            
            type : DataType.INTEGER,
            field : 'product_count'
        },
        
        productAmount : {
            
            type : DataType.FLOAT,
            field : 'product_amount'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}