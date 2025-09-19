var DataTypes = require('sequelize').DataTypes
var _user_message = require('./user_message')

function initModels(sequelize) {
  var user_message = _user_message(sequelize, DataTypes)

  return {
    user_message,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
