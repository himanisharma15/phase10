import mongoose from 'mongoose';

const categories = ['Application', 'Database', 'Network', 'Authentication', 'Deployment', 'Performance', 'Uncategorized'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const environments = ['Development', 'Staging', 'Production'];
const statuses = ['Open', 'In Progress', 'Resolved'];

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  incidentCode: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 4000 },
  service: { type: String, required: true, trim: true, maxlength: 120 },
  severity: { type: String, enum: severities, default: 'Medium' },
  environment: { type: String, enum: environments, default: 'Production' },
  category: { type: String, enum: categories, default: 'Uncategorized' },
  status: { type: String, enum: statuses, default: 'Open' },
  analysis: { summary: String, possibleCauses: [{ cause: String, reason: String }], recommendedSteps: [{ step: String, details: String }], confidence: Number, model: String },
  analysisStatus: { type: String, enum: ['Pending', 'Analyzing', 'Completed', 'Failed'], default: 'Pending' },
  analysisError: String,
  analyzedAt: Date
}, { timestamps: true, toJSON: { virtuals: true, transform: (_, ret) => { ret.id = ret._id; ret.created_at = ret.createdAt; delete ret._id; delete ret.__v; return ret; } } });

incidentSchema.index({ title: 'text', description: 'text', service: 'text' });
incidentSchema.index({ userId: 1, status: 1, severity: 1, createdAt: -1 });
export { categories, severities, environments, statuses };
export default mongoose.model('Incident', incidentSchema);
