/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('product_info',{
    
        
        productInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'product_info_pkid'
        },
        
        productId : {
            
            type : DataType.STRING,
            field : 'product_id'
        },
        
        productUrl : {
            
            type : DataType.STRING,
            field : 'product_url'
        },
        
        productTitle : {
            
            type : DataType.STRING,
            field : 'product_title'
        },
        
        productPrice : {
            
            type : DataType.FLOAT,
            field : 'product_price'
        },
        
        productKey : {
            
            type : DataType.STRING,
            field : 'product_key'
        },
        
        costPrice : {
            
            type : DataType.FLOAT,
            field : 'cost_price'
        },
        
        purchasePrice : {
            
            type : DataType.FLOAT,
            field : 'purchase_price'
        },
        
        platformCode : {
            
            type : DataType.STRING,
            field : 'platform_code'
        },
        
        platformName : {
            
            type : DataType.STRING,
            field : 'platform_name'
        },
        
        platformProductUrl : {
            
            type : DataType.STRING,
            field : 'platform_product_url'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}