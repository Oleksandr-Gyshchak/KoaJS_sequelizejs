'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "username  can not be empty"
        },
        len: [2, 20]
      }

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password  can not be empty"
        },
        len: [2, 20]
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });



  User.prototype.validPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
  }

  /*
    User.beforeCreate = async function (user) {

      const salt = await bcrypt.genSalt(10); 
      user.password = await bcrypt.hash(user.password, salt);

    }


  User.associate = function (models) {
    // associations can be defined here
  };

*/
  return User;
};