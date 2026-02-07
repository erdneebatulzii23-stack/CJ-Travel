import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await dbConnect();

    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (req.method === 'PATCH') {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "Update failed" });
      return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
