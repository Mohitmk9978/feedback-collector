import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      enum: ['bug', 'suggestion', 'improvement', 'general', 'other'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 5000,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'resolved'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
