const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "tmp/csv/" });

const validation = require("../validation");
const datasetService = require("../service/dataset");
const errorsService = require("../service/error");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", upload.single("file"), async function(req, res) {
  if (!req.file || !req.file.originalname) {
    return res.status(400).json("Invalid file");
  }
  let dataset = await datasetService.findByName(req.file.originalname);

  if (!dataset) {
    dataset = await datasetService.save({ name: req.file.originalname });
  } else {
    datasetService.update({ ...dataset, validated: false });
  }
  validation.validateCSV({ path: req.file.path, dataset });
  return res.status(200).json(dataset);
});

router.get("/dataset", async function(req, res) {
  const datasets = await datasetService.findAll();
  return res.status(200).json(datasets);
});

router.get("/dataset/:id/errors", async function(req, res) {
  const { id } = req.params;
  const errors = await errorsService.findAll({
    where: { datasetId: Number(id) }
  });
  return res.status(200).json(errors);
});

module.exports = router;
