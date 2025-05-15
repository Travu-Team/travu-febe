'use strict';

const { Sequelize } = require('sequelize');
const db = require('../config/database');

const User = require('./User')(db, Sequelize);

const models = {
  User
};

// Jika ada relasi antar model, definisikan di sini
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = db;
models.Sequelize = Sequelize;

module.exports = models;
