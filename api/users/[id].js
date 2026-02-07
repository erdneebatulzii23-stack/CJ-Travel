import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  // 1. ID-г URL-аас автоматаар авна (Гараар биш)
  const { id } = req.query;

  try {
    await dbConnect();

    // 2. ID-г шалгах
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (req.method === 'PATCH') {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "Update failed" });
      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
