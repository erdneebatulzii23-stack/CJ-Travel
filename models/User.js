import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  // Нууцлалын тохиргоог default-оор "true" буюу ил харагддаг болгоно
  privacy: {
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Хуучин байсан: export default mongoose.models.User || mongoose.model('User', UserSchema);
// Шинэ (Хүчээр заах):
export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');
