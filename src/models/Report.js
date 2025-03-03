import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  outreach: {
    type: Number,
    required: true
  },
  replies: {
    type: Number,
    required: true
  },
  booked: {
    type: Number,
    required: true
  },
  replyRate: {
    type: String
  },
  bookingRate: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema); 