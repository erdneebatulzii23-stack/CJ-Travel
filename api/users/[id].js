import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect.js';
import User from '../../models/User.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  const id = "69864861f4c3651ef8286e5d";

  try {
    await dbConnect();

    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (req.method === 'PATCH') {
      const { name, phone, profilePic, privacy } = req.body;
      const updateFields = {};
      if (name) updateFields.name = name;
      if (phone !== undefined) updateFields.phone = phone;
      if (profilePic) updateFields.profilePic = profilePic;
      if (privacy) {
        updateFields.privacy = {
          showEmail: privacy.showEmail ?? true,
          showPhone: privacy.showPhone ?? true
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedUser) return res.status(404).json({ message: "Update failed" });
      return res.status(200).json(updatedUser);
    }

    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
