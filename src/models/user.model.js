import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' } // Definiendo el campo 'role'
}, { timestamps: true });

export default mongoose.model('User', userSchema);