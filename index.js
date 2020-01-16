const http = require('http');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');

const Router = express.Router;

const upload = multer({ dest: 'tmp/csv/' });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;

const VALIDATIONS_ENUM = {
  MIN: 'min',
  MAX: 'max',
  TYPE: 'typeof',
  MAX_LENGTH: 'maxLength',
  MIN_LENGTH: 'minLength'
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

router.post('/', upload.single('file'), function(req, res) {
  csv
    .parseFile(req.file.path, { headers: true, maxRows: 3 })
    .validate(row => {
      console.log('row', `>${JSON.stringify(row)}<`);
    })
    .on('data-invalid', (wrongOne, index) => console.log(`wrongOne ${wrongOne}`))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

  return;
});

app.use('/upload-csv', router);

function startServer() {
  server.listen(port, function() {
    console.log('Express server listening on ', port);
  });
}

setImmediate(startServer);

module.exports = {
  isValid,
  getErrors,
  VALIDATIONS_ENUM
};
