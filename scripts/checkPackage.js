// import pkg from 'multer-storage-cloudinary';
// console.log('Package exports:', Object.keys(pkg));
// console.log('Full package:', pkg);
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
console.log('');
console.log('All loaded env keys:', Object.keys(process.env).filter(key => key.startsWith('CLOUDINARY')));