/**
 * Seed database with demo users and feedback.
 * Run: npm run seed (from server folder)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_collector';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected for seed');

  await Feedback.deleteMany({});
  await User.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const hashedUser = await bcrypt.hash('User123!', salt);
  const hashedAdmin = await bcrypt.hash('Admin123!', salt);

  const admin = await User.create({
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: hashedAdmin,
    role: 'admin',
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@demo.com',
    password: hashedUser,
    role: 'user',
  });

  const samples = [
    {
      title: 'Login button misaligned on mobile',
      category: 'bug',
      priority: 'high',
      rating: 3,
      message: 'On iPhone Safari the login button overlaps the footer.',
      status: 'pending',
      createdBy: user._id,
    },
    {
      title: 'Dark mode for dashboard',
      category: 'suggestion',
      priority: 'medium',
      rating: 5,
      message: 'Please add a toggle for dark mode in settings.',
      status: 'in_review',
      createdBy: user._id,
    },
    {
      title: 'Export reports as CSV',
      category: 'improvement',
      priority: 'low',
      rating: 4,
      message: 'Would love to export analytics to CSV for meetings.',
      status: 'resolved',
      createdBy: user._id,
    },
    {
      title: 'Great onboarding flow',
      category: 'general',
      priority: 'low',
      rating: 5,
      message: 'The tutorial was clear and fast.',
      status: 'resolved',
      createdBy: admin._id,
    },
  ];

  await Feedback.insertMany(samples);

  console.log('Seed complete.');
  console.log('Admin: admin@demo.com / Admin123!');
  console.log('User:  user@demo.com / User123!');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
