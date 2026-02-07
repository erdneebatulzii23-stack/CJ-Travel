import { connectToDatabase } from "../../lib/mongodb"; // Өөрийн холболтын файлыг ашиглана

export default async function handler(req, res) {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
        // Постуудыг сүүлийнх нь эхэнд байхаар татах
        const posts = await db.collection("posts")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const { text, image, userId, userName, userPic } = req.body;
        
        const newPost = {
            text,
            image,
            userId,
            userName,
            userPic,
            likes: [], // Хэн лайк дарсан ID-нуудыг хадгална
            comments: [],
            createdAt: new Date()
        };

        const result = await db.collection("posts").insertOne(newPost);
        return res.status(201).json({ success: true, postId: result.insertedId });
    }
}
