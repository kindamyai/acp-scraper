import mongoose, { Document, Schema } from 
'mongoose'; import bcrypt from 'bcrypt'; 
interface IUser extends Document {
  username: string; email: string; password: 
  string; createdAt: Date; updatedAt: Date; 
  comparePassword(candidatePassword: string): 
  Promise<boolean>;
}
const UserSchema = new Schema<IUser>({ 
  username: {
    type: String, required: true, trim: true, 
    unique: true,
  },
  email: { type: String, required: true, 
    unique: true, lowercase: true, trim: 
    true,
  },
  password: { type: String, required: true, 
    minlength: 6,
  },
  createdAt: { type: Date, default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now,
  },
});
// Update the 'updatedAt' field on save
UserSchema.pre('save', function(next) { 
  this.updatedAt = new Date(); next();
});
// Hash password before saving
UserSchema.pre('save', async function(next) { 
  if (!this.isModified('password')) return 
  next();
  
  try { const salt = await 
    bcrypt.genSalt(10); this.password = await 
    bcrypt.hash(this.password, salt); next();
  } catch (error) {
    next(error as Error);
  }
});
// Method to compare passwords
UserSchema.methods.comparePassword = async 
function(candidatePassword: string): 
Promise<boolean> {
  try { return await 
    bcrypt.compare(candidatePassword, 
    this.password);
  } catch (error) {
    throw error;
  }
};
export default mongoose.model<IUser>('User', 
UserSchema);
