const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (file.fieldname === "player") folder = "players";
    else if (file.fieldname === "team") folder = "teams";
    else if (file.fieldname === "kyc") folder = "kyc";
    

    const dir = `./upload/images/${folder}`;
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
