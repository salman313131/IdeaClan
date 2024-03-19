const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('book',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    addedBy:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    owner:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    availableForBorrow:{
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
})

module.exports = Book