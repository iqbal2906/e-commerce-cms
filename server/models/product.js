'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Product.init({
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: `Name cannot be empty`
                }
            }
        },
        image_url: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: `Image_url cannot be empty`
                },
            }
        },
        price: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: {
                    msg: "Price must be number"
                },
                min: {
                    args: [0],
                    msg: 'Price must be greater than 0'
                },
                notEmpty: {
                    msg: `Price cannot be empty`
                },
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: `Stock cannot be empty`
                },
                min: {
                    args: [0],
                    msg: "Stock must be more than 0"
                },
                isInt: {
                    msg: "Stock must be number"
                }
            }
        },
        category: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};