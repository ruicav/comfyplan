const db = require("../models");
const { error } = db;

module.exports = {
  save: async newError => error.create(newError),
  findAll: async query => error.findAll({ where: query })
};
