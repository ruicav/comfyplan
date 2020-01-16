module.exports = (sequelize, DataTypes) => {
  const error = sequelize.define("error", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    row: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    datasetId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: { msg: "Deve referenciar um dataset" }
      }
    },
    errors: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });

  error.associate = function(models) {
    error.belongsTo(models.dataset, {
      foreignKey: "datasetId",
      as: "dataset"
    });
  };
  return error;
};
