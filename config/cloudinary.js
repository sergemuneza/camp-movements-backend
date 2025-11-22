// // import { v2 as cloudinary } from 'cloudinary';
// // import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // // Configure Cloudinary
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET
// // });

// // // Configure Multer Storage for Cloudinary
// // export const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: {
// //     folder: 'personnel-photos',
// //     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
// //     transformation: [
// //       { width: 800, height: 800, crop: 'limit' },
// //       { quality: 'auto' }
// //     ],
// //     public_id: (req, file) => {
// //       const personnelId = req.body.personnelId || 'unknown';
// //       return `${personnelId}_${Date.now()}`;
// //     }
// //   }
// // });

// // export default cloudinary;
// import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';
// import CloudinaryStorage from 'multer-storage-cloudinary';

// // Load environment variables FIRST
// dotenv.config();

// // Configure Cloudinary AFTER env vars are loaded
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Configure Multer Storage for Cloudinary
// export const storage = CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'personnel-photos',
//     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
//     transformation: [{ width: 800, height: 800, crop: 'limit' }]
//   }
// });

// export default cloudinary;
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';

// Load environment variables FIRST
dotenv.config();

// Configure Cloudinary AFTER env vars are loaded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
// Pass cloudinary with the v2 property explicitly
export const storage = CloudinaryStorage({
  cloudinary: { v2: cloudinary }, // ← KEY FIX: wrap in object with v2 property
  params: {
    folder: 'personnel-photos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

export default cloudinary;