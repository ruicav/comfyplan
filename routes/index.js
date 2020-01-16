const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

const router = express.Router();
const upload = multer({ dest: "tmp/csv/" });

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", upload.single("file"), function(req, res) {
  csv
    .parseFile(req.file.path, { headers: true, maxRows: 3 })
    .validate(row => {
      console.log("row", `>${JSON.stringify(row)}<`);
    })
    .on("data-invalid", (wrongOne, index) =>
      console.log(`wrongOne ${wrongOne}`)
    )
    .on("error", error => console.error(error))
    .on("data", row => console.log(row))
    .on("end", rowCount => console.log(`Parsed ${rowCount} rows`));

  return;
});

module.exports = router;
