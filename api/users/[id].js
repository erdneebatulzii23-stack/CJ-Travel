import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  const testId = "69864861f4c3651ef8286e5d";

  try {
    await dbConnect();

    if (req.method === 'GET') {
      const user = await User.findById(testId).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (req.method === 'PATCH') {
      const updatedUser = await User.findByIdAndUpdate(
        testId,
        { $set: req.body },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "Update failed" });
      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
