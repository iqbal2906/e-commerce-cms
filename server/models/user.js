'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: `Email Address is not Unique` },
            validate: {
                notNull: { msg: `Email Address required` },
                isEmail: { msg: `Invalid Email format` }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: `Password required` },
                len: { args: [4, 15], msg: `Password length must be between 4 and 15 characters` }
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};