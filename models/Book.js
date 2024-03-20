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
    isAvailable:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    owner:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    ownerType:{
        type: Sequelize.ENUM,
        values: ['owned','borrowed','free'],
        defaultValue: 'free'
    }
})

module.exports = Book