import mongoose, { Document, Schema } from 
'mongoose'; interface IConfig extends 
Document {
  configId: string; name: string; userId: 
  mongoose.Types.ObjectId; config: any; 
  isPublic: boolean; createdAt: Date; 
  updatedAt: Date;
}
const ConfigSchema = new Schema({ configId: { 
    type: String, required: true, unique: 
    true,
  },
  name: { type: String, required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 
    'User', required: true,
  },
  config: { type: Schema.Types.Mixed, 
    required: true,
  },
  isPublic: { type: Boolean, default: false,
  },
  createdAt: { type: Date, default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now,
  },
});
// Compound index for finding user 
// configurations
ConfigSchema.index({ userId: 1, name: 1 }, { 
unique: true }); export default 
mongoose.model<IConfig>('Config', 
ConfigSchema);
