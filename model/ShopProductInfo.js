/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('shop_product_info',{
    
        
        shopProductId : {
            
            type : DataType.STRING,
            field : 'shop_product_id'
        },
        
        productInfoPkid : {
            
            type : DataType.STRING,
            field : 'product_info_pkid'
        },
        
        shopInfoPkid : {
            
            type : DataType.STRING,
            field : 'shop_info_pkid'
        },
        
        platformProductId : {
            
            type : DataType.STRING,
            field : 'platform_product_id'
        },
        
        undercarrigeFlag : {
            
            type : DataType.STRING,
            field : 'undercarrige_flag'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}