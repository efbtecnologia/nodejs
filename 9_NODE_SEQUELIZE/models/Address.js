const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./User')
const Address = db.define('Address', {
    street: {
        type: DataTypes.STRING,
        required: true,
    },
    number: {
        type: DataTypes.STRING,
        required: true,

    },
    city: {
        type: DataTypes.STRING,
        required: true,
    },
})

User.hasMany(Address) //user 1 x N address
Address.belongsTo(User) //N address x 1 User

module.exports = Address