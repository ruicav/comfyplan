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

// invalid schema
// const getSchema = () => [...Array(12).keys()]
//    .map((value, index) => index === 0
//      ? {'RA_Report #': [{ type: 'min', value: 65326 }]}
//      : undefined)
const getSchema = () => ({
  'RA_Report #': [{ type: 'min', value: 65326 }]
})

const isValid = ({ row = {}, schema = {} }) => {
  const errors = []
  console.log('is Valid row', row)
  for (const columnKey in row) {
    console.log('columnKey', columnKey)
    if (schema[columnKey]) {
        console.log('includes')
        console.log('schema[columnKey]', JSON.stringify(schema[columnKey]))
        for(const validation of schema[columnKey]) {
          console.log('validation', validation)
          switch(validation.type) {
            case 'min':
              console.log('min validation')
              console.log('Number(row[columnKey])', Number(row[columnKey]))
              if(Number.isNaN(Number(row[columnKey]))) {
                errors.push('Numero invalido')
              }
              console.log('Number(row[columnKey]) > validation.value', Number(row[columnKey]) > Number(validation.value))
              if(Number(row[columnKey]) < Number(validation.value)) {
                errors.push('Valor minimo invalido')
              }
          }
        }
        console.log('errors', errors)
        return errors.length === 0;
    }
  }
  console.log('row without validation in schema')
  return true;
}


router.post('/', upload.single('file'), function (req, res) {
  //req.file.path
  // const headers = schema.map(column => column && Object.keys(column)[0])
  csv.parseFile(req.file.path, { headers: true, maxRows: 3 })
    .validate( row => {
      console.log('row', `>${JSON.stringify(row)}<`) 
    })
    .on("data-invalid", (wrongOne, index) => console.log(`wrongOne ${wrongOne}`))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
  
  return;
}); 

app.use('/upload-csv', router);

function startServer() {
  server.listen(port, function () {
    console.log('Express server listening on ', port);
  });
}

setImmediate(startServer);

module.exports = {
  getSchema,
  isValid
};