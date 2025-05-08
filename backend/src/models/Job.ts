import mongoose, { Document, Schema } from 
'mongoose'; interface IJob extends Document {
  jobId: string; userId: 
  mongoose.Types.ObjectId | null; config: 
  any; status: 'queued' | 'running' | 
  'completed' | 'failed' | 'cancelled'; logs: 
  string[]; results: any[]; error?: string; 
  createdAt: Date; completedAt?: Date;
}
const JobSchema = new Schema({ jobId: { type: 
    String, required: true, unique: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 
    'User', required: false,
  },
  config: { type: Schema.Types.Mixed, 
    required: true,
  },
  status: { type: String, enum: ['queued', 
    'running', 'completed', 'failed', 
    'cancelled'], default: 'queued',
  },
  logs: { type: [String], default: [],
  },
  results: { type: [Schema.Types.Mixed], 
    default: [],
  },
  error: { type: String,
  },
  createdAt: { type: Date, default: Date.now,
  },
  completedAt: { type: Date,
  },
});
// Add TTL index to automatically remove old 
// jobs
JobSchema.index({ createdAt: 1 }, { 
expireAfterSeconds: 7 * 24 * 60 * 60 }); // 7 
days export default 
mongoose.model<IJob>('Job', JobSchema);
