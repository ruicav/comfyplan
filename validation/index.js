const express = require("express");

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

module.exports = {
  isValid,
  getErrors,
  VALIDATIONS_ENUM
};
