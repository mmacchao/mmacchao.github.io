const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user_message',
    {
      messageId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '消息id',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '消息主体',
      },
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      origin_json: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: '原始消息',
      },
      create_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '消息本身的时间',
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '本记录存到数据库的时间',
      },
      user_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '',
      },
      user_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '',
      },
    },
    {
      sequelize,
      tableName: 'user_message',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    },
  )
}
