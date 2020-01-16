module.exports = (sequelize, DataTypes) => {
  const dataset = sequelize.define("dataset", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    validated: {
      type: DataTypes.BOOLEAN
    }
  });

  return dataset;
};
