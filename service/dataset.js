const db = require("../models");
const { dataset } = db;

module.exports = {
  findByName: async name => dataset.findOne({ where: { name } }),
  save: async newDataset => dataset.create(newDataset),
  update: async newDataset => dataset.update(newDataset),
  findAll: async () => dataset.findAll()
};
