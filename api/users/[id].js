import dbConnect from '../../lib/dbConnect.js'; // .js нэмэв
import User from '../../models/User.js';       // .js нэмэв

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    const { id } = req.query;
    
    try {
        await dbConnect();
    } catch (dbError) {
        return res.status(500).json({ message: "Database connection failed" });
    }

    if (req.method === 'GET') {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PATCH') {
        try {
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

            if (!updatedUser) return res.status(404).json({ message: "User not found" });
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
