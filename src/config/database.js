import { Sequelize } from 'sequelize';

// قم بإنشاء قاعدة بيانات باسم assignment5_db في MySQL أولاً
export const sequelize = new Sequelize('assignment5_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});