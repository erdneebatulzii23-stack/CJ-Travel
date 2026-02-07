import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

// 1. Зургийн хэмжээний хязгаарыг нэмэх
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    const { id } = req.query;
    await dbConnect();

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
            // ЭНД: Authentication (JWT token) шалгах логик байвал сайн. 
            // Одоогоор шууд хадгалах хэсгийг нь сайжруулъя.
            
            const { name, phone, profilePic, privacy } = req.body;
            
            // Зөвхөн ирсэн талбаруудыг л шинэчлэх (Data validation)
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
            console.error("Patch Error:", error);
            return res.status(500).json({ message: "Server error during update" });
        }
    }

    res.setHeader('Allow', ['GET', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
