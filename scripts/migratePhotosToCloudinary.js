// scripts/migratePhotosToCloudinary.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js'; // Import default export
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const migratePhotos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({ 
      profilePhotoUrl: { $regex: '^/uploads/' } // Only local photos
    });

    console.log(`📊 Found ${users.length} users with local photos`);

    for (const user of users) {
      try {
        // Get local file path
        const localPath = path.join(process.cwd(), 'uploads', path.basename(user.profilePhotoUrl));
        
        // Check if file exists
        if (!fs.existsSync(localPath)) {
          console.log(`⚠️  File not found for ${user.name}: ${localPath}`);
          continue;
        }

        console.log(`📤 Uploading photo for ${user.name}...`);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'personnel-photos',
          public_id: `${user.personnelId}_${Date.now()}`,
          transformation: [{ width: 800, height: 800, crop: 'limit' }]
        });

        // Update user with Cloudinary URL
        user.profilePhotoUrl = result.secure_url;
        await user.save();

        console.log(`✅ Migrated photo for ${user.name}`);
        console.log(`   Old: ${localPath}`);
        console.log(`   New: ${result.secure_url}`);

        // Optional: Delete local file after successful upload
        // fs.unlinkSync(localPath);

      } catch (error) {
        console.error(`❌ Error migrating photo for ${user.name}:`, error.message);
      }
    }

    console.log('🎉 Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migratePhotos();