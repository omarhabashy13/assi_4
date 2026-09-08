import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
}, {
  hooks: {
    beforeCreate: (user) => {
      user.checkNameLength();
    },
  },
});

User.prototype.checkPasswordLength = function () {
  if (this.password && this.password.length <= 6) {
    throw new Error('Password must be greater than 6 characters.');
  }
};

User.prototype.checkNameLength = function () {
  if (this.name && this.name.length <= 2) {
    throw new Error('Name must be greater than 2 characters.');
  }
};