import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    
    const result = await cloudinary.api.ping();
    
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Status:', result.status);
    console.log('☁️  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();