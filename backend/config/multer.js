const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (file.fieldname === "player") folder = "players";
    else if (file.fieldname === "team") folder = "teams";
    else if (file.fieldname === "kyc") folder = "kyc";
    else if (file.fieldname === "chatFile") folder = "chat";
    

    const dir = `./upload/images/${folder}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file size (additional check)
    if (file.size > 5 * 1024 * 1024) {
      return cb(new Error('File size must be less than 5MB'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
