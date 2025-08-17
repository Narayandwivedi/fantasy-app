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

    // Create compressed WebP filename and path
    const compressedFilename = `${baseFilename}_compressed.webp`;
    const compressedPath = path.join("upload/images/players", compressedFilename);

    // Generate WebP with high compression
    await sharp(originalPath)
      .resize(152, 152, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 75,
      })
      .toFile(compressedPath);

    // Check file size
    const stats = await fs.stat(compressedPath);
    const fileSizeKB = stats.size / 1024;
    
    console.log(`WebP image size: ${fileSizeKB.toFixed(2)} KB`);

    // Try to delete original file
    try {
      await fs.unlink(originalPath);
    } catch (unlinkError) {
      console.warn("Could not delete original file:", unlinkError.message);
    }

    res.json({
      success: true,
      image_url: `/images/players/${compressedFilename}`,
      file_size_kb: parseFloat(fileSizeKB.toFixed(2)),
      dimensions: "152x152",
      format: "webp"
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

async function handleBlogImgUpload(req, res) {
  try {
    console.log(req.file);
    
    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);
    const baseFilename = path.basename(filename, fileExtension);

    // Create compressed WebP filename and path
    const compressedFilename = `${baseFilename}_compressed.webp`;
    const compressedPath = path.join("upload/images/blogs", compressedFilename);

    // Ensure the blogs directory exists
    const blogsDir = path.dirname(compressedPath);
    try {
      await fs.mkdir(blogsDir, { recursive: true });
    } catch (mkdirError) {
      console.warn("Directory might already exist:", mkdirError.message);
    }

    // Generate WebP with high compression for blog featured images (optimized for SEO)
    await sharp(originalPath)
      .resize(1200, 675, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 80,
      })
      .toFile(compressedPath);

    // Check file size
    const stats = await fs.stat(compressedPath);
    const fileSizeKB = stats.size / 1024;
    
    console.log(`Blog image size: ${fileSizeKB.toFixed(2)} KB`);

    // Try to delete original file
    try {
      await fs.unlink(originalPath);
    } catch (unlinkError) {
      console.warn("Could not delete original file:", unlinkError.message);
    }

    res.json({
      success: true,
      image_url: `/images/blogs/${compressedFilename}`,
      file_size_kb: parseFloat(fileSizeKB.toFixed(2)),
      dimensions: "1200x675",
      format: "webp"
    });
  } catch (err) {
    console.error("Error processing blog image:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function handleBlogContentImgUpload(req, res) {
  try {
    console.log(req.file);
    
    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);
    const baseFilename = path.basename(filename, fileExtension);

    // Create compressed WebP filename and path for blog content images
    const compressedFilename = `${baseFilename}_compressed.webp`;
    const compressedPath = path.join("upload/images/blog-content", compressedFilename);

    // Ensure the blog-content directory exists
    const blogContentDir = path.dirname(compressedPath);
    try {
      await fs.mkdir(blogContentDir, { recursive: true });
    } catch (mkdirError) {
      console.warn("Directory might already exist:", mkdirError.message);
    }

    // Generate WebP with good quality for blog content images
    await sharp(originalPath)
      .resize(1200, 800, {
        fit: "inside", // Maintain aspect ratio
        withoutEnlargement: true, // Don't upscale small images
      })
      .webp({
        quality: 85, // Higher quality for content images
      })
      .toFile(compressedPath);

    // Check file size
    const stats = await fs.stat(compressedPath);
    const fileSizeKB = stats.size / 1024;
    
    console.log(`Blog content image size: ${fileSizeKB.toFixed(2)} KB`);

    // Try to delete original file
    try {
      await fs.unlink(originalPath);
    } catch (unlinkError) {
      console.warn("Could not delete original file:", unlinkError.message);
    }

    res.json({
      success: true,
      image_url: `/images/blog-content/${compressedFilename}`,
      file_size_kb: parseFloat(fileSizeKB.toFixed(2)),
      format: "webp"
    });
  } catch (err) {
    console.error("Error processing blog content image:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Delete blog image function
async function deleteBlogImage(req, res) {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image path is required"
      });
    }

    // Sanitize the path to prevent directory traversal
    const sanitizedPath = path.normalize(imagePath).replace(/^(\.\.[\/\\])+/, '');
    
    // Construct full file path
    let fullPath;
    if (sanitizedPath.startsWith('/images/blogs/')) {
      fullPath = path.join('upload', sanitizedPath);
    } else if (sanitizedPath.startsWith('/images/blog-content/')) {
      fullPath = path.join('upload', sanitizedPath);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid image path"
      });
    }

    // Check if file exists before attempting to delete
    try {
      await fs.access(fullPath);
    } catch (accessError) {
      return res.status(404).json({
        success: false,
        message: "Image file not found"
      });
    }

    // Delete the file
    await fs.unlink(fullPath);

    res.json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting blog image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image"
    });
  }
}

module.exports = { handlePlayerImgUpload, handleTeamImgUpload, handleChatFileUpload, handleBlogImgUpload, handleBlogContentImgUpload, deleteBlogImage};
