    const sharp = require('sharp');
    const path = require('path');
    const fs = require('fs').promises;

    async function handlePlayerImgUpload(req, res) {
    try {

        console.log(req.file);
        
        
        // Get the original uploaded file path
        const originalPath = req.file.path;
        const filename = req.file.filename;
        const fileExtension = path.extname(filename);
        const baseFilename = path.basename(filename, fileExtension);
        
        // Create compressed filename and path
        const compressedFilename = `${baseFilename}_compressed.jpg`;
        const compressedPath = path.join('upload/images/players', compressedFilename);
        
      
        
        
        
        
        // Compress and resize image
        await sharp(originalPath)
        .resize(200, 200, { // Resize to 200x200px for fantasy app
            fit: 'cover',
            position: 'center'
        })
        .jpeg({ 
            quality: 80, // Compress to 80% quality
            progressive: true 
        })
        .toFile(compressedPath);
        
        // Try to delete original file, but don't fail if it can't be deleted
        try {
        await fs.unlink(originalPath);
        } catch (unlinkError) {
        console.warn('Could not delete original file:', unlinkError.message);
        // Continue anyway - the compressed file was created successfully
        }
        
        res.json({
        success: true,
        image_url: `http://localhost:${process.env.PORT}/images/players/${compressedFilename}`,
        });
    } catch (err) {
        console.error('Error processing player image');
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
        const compressedPath = path.join('upload/images/teams', compressedFilename);
        
        // Compress and resize image
        await sharp(originalPath)
        .resize(150, 150, { // Resize to 150x150px for team logos
            fit: 'cover',
            position: 'center'
        })
        .jpeg({ 
            quality: 85, // Slightly higher quality for team logos
            progressive: true 
        })
        .toFile(compressedPath);
        
        // Try to delete original file, but don't fail if it can't be deleted
        try {
        await fs.unlink(originalPath);
        } catch (unlinkError) {
        console.warn('Could not delete original file:', unlinkError.message);
        // Continue anyway - the compressed file was created successfully
        }
        
        res.json({
        success: true,
        image_url: `http://localhost:${process.env.PORT}/images/teams/${compressedFilename}`,
        });
    } catch (err) {
        console.error('Error processing team image:', err);
        res.status(500).json({ success: false, message: err.message });
    }
    }

    // Alternative function with configurable options
    async function processImage(inputPath, outputPath, options = {}) {
    const {
        width = 150,
        height = 150,
        quality = 80,
        format = 'jpeg'
    } = options;
    
    let sharpInstance = sharp(inputPath)
        .resize(width, height, {
        fit: 'cover',
        position: 'center'
        });
    
    if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
    } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ compressionLevel: 8 });
    } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
    }
    
    await sharpInstance.toFile(outputPath);
    }

    module.exports = { handlePlayerImgUpload, handleTeamImgUpload, processImage };