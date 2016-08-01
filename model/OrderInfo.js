/**
* Created by Orangexiao on 2015/5/13.
*/
module.exports = function(sequelize,DataType){

return sequelize.define('order_info',{
    
        
        orderInfoPkid : {
            
            primaryKey : true,
            unique : true,
            
            type : DataType.STRING,
            field : 'order_info_pkid'
        },
        
        orderNo : {
            
            type : DataType.STRING,
            field : 'order_no'
        },
        
        buyer : {
            
            type : DataType.STRING,
            field : 'buyer'
        },
        
        buyerAddress : {
            
            type : DataType.STRING,
            field : 'buyer_address'
        },
        
        buyerEmail : {
            
            type : DataType.STRING,
            field : 'buyer_email'
        },
        
        payTypeCode : {
            
            type : DataType.STRING,
            field : 'pay_type_code'
        },
        
        payType : {
            
            type : DataType.STRING,
            field : 'pay_type'
        },
        
        deliveryTypeCode : {
            
            type : DataType.STRING,
            field : 'delivery_type_code'
        },
        
        deliveryType : {
            
            type : DataType.STRING,
            field : 'delivery_type'
        },
        
        orderStatusCode : {
            
            type : DataType.STRING,
            field : 'order_status_code'
        },
        
        expressNo : {
            
            type : DataType.STRING,
            field : 'express_no'
        },
        
        orderDate : {
            
            type : DataType.DATE,
            field : 'order_date'
        },
        
        orderSum : {
            
            type : DataType.FLOAT,
            field : 'order_sum'
        }
        
    }
    ,
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        timestamps : false
    }
    );
}