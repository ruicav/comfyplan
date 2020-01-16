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

const isValid = ({ row = {}, schema = {} }) => {
  const errors = [];
  for (const columnKey in row) {
    if (schema[columnKey]) {
      for (const validation of schema[columnKey]) {
        switch (validation.type) {
          case 'min':
            if (Number(row[columnKey]) < Number(validation.value)) {
              errors.push('Valor minimo invalido');
            }
          case 'max':
            if (Number(row[columnKey]) > Number(validation.value)) {
              errors.push('Valor maximo invalido');
            }
        }
      }
      console.log('errors', errors);
      return errors.length === 0;
    }
  }
  console.log('row without validation in schema');
  return true;
};

router.post('/', upload.single('file'), function(req, res) {
  //req.file.path
  // const headers = schema.map(column => column && Object.keys(column)[0])
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
  isValid
};
