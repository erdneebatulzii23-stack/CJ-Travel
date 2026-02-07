import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await dbConnect();

    // ID формат шалгах (Буруу ID орж ирвэл сервер crash болохоос сэргийлнэ)
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // GET Хүсэлт: Хэрэглэгчийн мэдээлэл авах
    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    // PATCH Хүсэлт: Мэдээлэл шинэчлэх
    if (req.method === 'PATCH') {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
