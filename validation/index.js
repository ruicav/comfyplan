const csv = require("fast-csv");

const datasetService = require("../service/dataset");
const errorService = require("../service/error");

const VALIDATIONS_ENUM = {
  MIN: "min",
  MAX: "max",
  TYPE: "typeof",
  MAX_LENGTH: "maxLength",
  MIN_LENGTH: "minLength"
};

const getErrors = ({ schema = {}, row = {} }) => {
  const errors = [];
  for (const columnKey in row) {
    if (schema[columnKey]) {
      for (const validation of schema[columnKey]) {
        const { type, value, message } = validation;
        switch (type) {
          case VALIDATIONS_ENUM.MIN:
            if (Number(row[columnKey]) < Number(value)) {
              errors.push(message + `. Found: ${Number(row[columnKey])}`);
            }
            break;
          case VALIDATIONS_ENUM.MAX:
            if (Number(row[columnKey]) > Number(value)) {
              errors.push(message + `. Found: ${Number(row[columnKey])}`);
            }
            break;
          case VALIDATIONS_ENUM.TYPE:
            if (typeof row[columnKey] !== value) {
              errors.push(message + `. Found: ${typeof row[columnKey]}`);
            }
            break;
          case VALIDATIONS_ENUM.MAX_LENGTH:
            if (row[columnKey].length > value) {
              errors.push(message + `. Found: ${row[columnKey].length}`);
            }
            break;
          case VALIDATIONS_ENUM.MIN_LENGTH:
            if (row[columnKey].length < value) {
              errors.push(message + `. Found: ${row[columnKey].length}`);
            }
            break;
          default:
            return true;
        }
      }
    }
  }
  return errors;
};

const isValid = ({ row = {}, schema = {} }) => {
  return getErrors({ schema, row }).length === 0;
};

const validateCSV = ({ path, dataset = {} }) => {
  const schema = {
    "RA_Report #": [
      {
        type: VALIDATIONS_ENUM.MIN,
        value: 66326,
        message: "Invalid min value"
      }
    ]
  };
  csv
    .parseFile(path, { headers: true })
    .validate(row => {
      return isValid({ row, schema });
    })
    .on("data-invalid", (wrongOne, index) => {
      const errors = getErrors({ row: wrongOne, schema }).toString();
      errorService.save({ row: index, datasetId: dataset.id, errors });
    })
    .on("error", error => console.log("error", error))
    .on("end", rowCount => {
      datasetService.update({ ...dataset, validated: true });
    });
};

module.exports = {
  validateCSV,
  VALIDATIONS_ENUM
};
