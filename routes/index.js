const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

const router = express.Router();
const upload = multer({ dest: "tmp/csv/" });

const validation = require("../validation");
const datasetService = require("../service/dataset");
const errorService = require("../service/error");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", upload.single("file"), async function(req, res) {
  const schema = {
    "RA_Report #": [
      {
        type: validation.VALIDATIONS_ENUM.MIN,
        value: 66326,
        message: "Invalid min value"
      }
    ]
  };

  let dataset = await datasetService.findByName(req.file.originalname);

  if (!dataset) {
    dataset = await datasetService.save({ name: req.file.originalname });
  } else {
    datasetService.update({ ...dataset, validated: false });
  }

  csv
    .parseFile(req.file.path, { headers: true })
    .validate(row => {
      return validation.isValid({ row, schema });
    })
    .on("data-invalid", (wrongOne, index) => {
      const errors = validation.getErrors({ row: wrongOne, schema }).toString();
      errorService.save({ row: index, datasetId: dataset.id, errors });
    })
    .on("error", error => console.error(error))
    .on("end", rowCount => {
      console.log(`Parsed ${rowCount} rows`);
      datasetService.update({ ...dataset, validated: true });
    });

  return res.status(200).json(dataset);
});

module.exports = router;
