import mongoose from 'mongoose'; // Энэ мөрийг заавал нэмнэ!
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    const { id } = req.query;
    // URL-аас ID ирээгүй бол чиний баталгаатай ID-г ашиглана
    const targetId = id || "69864861f4c3651ef8286e5d";

    // ID-г шалгах (Import хийсэн mongoose-ийг энд ашиглаж байна)
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (req.method === 'GET') {
      const user = await User.findById(targetId).select('-password');
      if (!user) return res.status(404).json({ message: "User not found in DB" });
      return res.status(200).json(user);
    }

    if (req.method === 'PATCH') {
      const updatedUser = await User.findByIdAndUpdate(
        targetId,
        { $set: req.body },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "Update failed" });
      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
