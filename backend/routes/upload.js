const router = require('express').Router();
const cloudinary = require('../config/cloudinary');
const logger = require('../config/logger');

// This route generates a signature for direct browser-to-Cloudinary uploads.
router.route('/signature').get((req, res) => {
  // Get the current timestamp in seconds.
  const timestamp = Math.round((new Date).getTime() / 1000);

  try {
    // Use the Cloudinary SDK to generate a signature.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        // Optional: You can add transformations or tags here if needed.
        // folder: 'goodmeat-products' // Example: upload to a specific folder
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature and timestamp back to the frontend.
    res.status(200).json({ timestamp, signature });

  } catch (error) {
    logger.error('Error generating Cloudinary signature: %o', error);
    res.status(500).json({ message: 'Could not generate upload signature.' });
  }
});

module.exports = router;