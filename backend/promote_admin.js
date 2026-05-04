import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const emailToPromote = 'meenakship928@gmail.com'; // Change this to your registered email

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB 🚀');

    const user = await User.findOne({ email: emailToPromote.toLowerCase() });

    if (!user) {
      console.log(`❌ User not found for email: ${emailToPromote}. Please signup first.`);
      process.exit(1);
    }

    console.log(`Found User: ${user.name} | ID: ${user._id} | Current Role: ${user.role}`);
    
    user.role = 'SUPER_ADMIN';
    await user.save();

    // Verify the change
    const updatedUser = await User.findById(user._id);
    console.log(`✅ Success! Updated Role: ${updatedUser.role}`);
    console.log('You can now see the Admin Panel in the Navbar profile dropdown.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error.message);
    process.exit(1);
  }
};

promoteUser();
