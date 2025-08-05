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
    const compressedFilename = `${baseFilename}_compressed.png`;
    const compressedPath = path.join("upload/images/teams", compressedFilename);

    // Compress and resize image
    await sharp(originalPath)
      .resize(150, 150, {
        // Resize to 150x150px for team logos
        fit: "cover",
        position: "center",
      })
      .png({
        progressive: true,         
        compressionLevel: 2,       
        quality: 70,                
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
      image_url: `/images/teams/${compressedFilename}`,
    });
  } catch (err) {
    console.error("Error processing team image:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}


async function handleChatFileUpload(req, res) {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Additional file size check (in case multer limit is bypassed)
    if (req.file.size > 5 * 1024 * 1024) {
      // Delete the uploaded file if it exceeds size limit
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.warn("Could not delete oversized file:", unlinkError.message);
      }
      return res.status(400).json({ 
        success: false, 
        message: 'File size must be less than 5MB' 
      });
    }

    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);
    const baseFilename = path.basename(filename, fileExtension);

    // Check if it's an image file
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const isImage = imageExtensions.includes(fileExtension.toLowerCase());

    // Validate file type (optional - allow common file types)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      // Delete the uploaded file if it's not an allowed type
      try {
        await fs.unlink(originalPath);
      } catch (unlinkError) {
        console.warn("Could not delete invalid file:", unlinkError.message);
      }
      return res.status(400).json({ 
        success: false, 
        message: 'File type not allowed. Please upload images, PDFs, or documents.' 
      });
    }

    // No compression for chat files since they're deleted in 24 hours
    // Just return the original file for best quality
    res.json({
      success: true,
      file_url: `/images/chat/${filename}`,
      file_type: isImage ? 'image' : 'file',
      file_size: req.file.size
    });
  } catch (err) {
    console.error("Error processing chat file:", err);
    
    // Handle multer file size error specifically
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size must be less than 5MB' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'File upload failed. Please try again.' 
    });
  }
}

module.exports = { handlePlayerImgUpload, handleTeamImgUpload, handleChatFileUpload};
