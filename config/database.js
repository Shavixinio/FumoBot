const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite',
    logging: false
});

// Define the Warnings model
const Warnings = sequelize.define('Warnings', {
    userId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    guildId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    moderatorId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reason: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    timestamp: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = { sequelize, Warnings };