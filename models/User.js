const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
})

module.exports = User