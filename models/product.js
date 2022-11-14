'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {}
    }
    Product.init(
        {
            name: DataTypes.STRING,
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Product',
        },
    )
    return Product
}
