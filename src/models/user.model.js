import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    email: { type: String, unique: true },
    password: { type: String },
    carts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
      default: null,
    },
    role: { type: String, enum: ['ADMIN', 'USER', 'PREMIUM'], default: 'USER' },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
