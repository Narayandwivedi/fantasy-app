const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

async function handlePlayerImgUpload(req, res) {
  try {
    console.log(req.file);
    
    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);
    const baseFilename = path.basename(filename, fileExtension);

    // Create compressed filename and path
    const compressedFilename = `${baseFilename}_compressed.png`;
    const compressedPath = path.join(
      "upload/images/players",
      compressedFilename
    );

    // Aggressive compression with fixed 80x80 size and reduced color palette
    await sharp(originalPath)
      .resize(152, 152, {
        fit: "cover",
        position: "center",
      })
      .png({
        progressive: true,         // Disable progressive for smaller files
        compressionLevel: 2,        // Maximum PNG compression
        quality: 70,                
      })
      .toFile(compressedPath);

    // Check final file size
    const stats = await fs.stat(compressedPath);
    const fileSizeKB = stats.size / 1024;
    
    console.log(`Compressed image size: ${fileSizeKB.toFixed(2)} KB`);

    // Try to delete original file
    try {
      await fs.unlink(originalPath);
    } catch (unlinkError) {
      console.warn("Could not delete original file:", unlinkError.message);
    }

    // Get final file size for response
    const finalStats = await fs.stat(compressedPath);
    const finalSizeKB = finalStats.size / 1024;

    res.json({
      success: true,
      image_url: `/images/players/${compressedFilename}`,
      file_size_kb: parseFloat(finalSizeKB.toFixed(2)),
      dimensions: "80x80"
    });
  } catch (err) {
    console.error("Error processing player image:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}


async function handleTeamImgUpload(req, res) {
  try {
    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);
    const baseFilename = path.basename(filename, fileExtension);

    // Create compressed filename and path
    const compressedFilename = `${baseFilename}_compressed.jpg`;
    const compressedPath = path.join("upload/images/teams", compressedFilename);

    // Compress and resize image
    await sharp(originalPath)
      .resize(150, 150, {
        // Resize to 150x150px for team logos
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 85, // Slightly higher quality for team logos
        progressive: true,
      })
      .toFile(compressedPath);

    // Try to delete original file, but don't fail if it can't be deleted
    try {
      await fs.unlink(originalPath);
    } catch (unlinkError) {
      console.warn("Could not delete original file:", unlinkError.message);
      // Continue anyway - the compressed file was created successfully
    }

    res.json({
      success: true,
      image_url: `http://localhost:${process.env.PORT}/images/teams/${compressedFilename}`,
    });
  } catch (err) {
    console.error("Error processing team image:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Alternative function with configurable options
async function processImage(inputPath, outputPath, options = {}) {
  const { width = 150, height = 150, quality = 80, format = "jpeg" } = options;

  let sharpInstance = sharp(inputPath).resize(width, height, {
    fit: "cover",
    position: "center",
  });

  if (format === "jpeg") {
    sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
  } else if (format === "png") {
    sharpInstance = sharpInstance.png({ compressionLevel: 8 });
  } else if (format === "webp") {
    sharpInstance = sharpInstance.webp({ quality });
  }

  await sharpInstance.toFile(outputPath);
}

module.exports = { handlePlayerImgUpload, handleTeamImgUpload, processImage };
