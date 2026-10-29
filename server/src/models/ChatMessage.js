import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true, maxlength: 8000 },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('ChatMessage', chatSchema);
