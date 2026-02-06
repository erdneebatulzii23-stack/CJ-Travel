import { MongoClient } from 'mongodb';

// Холболтыг функцийн гадна зарлаж "cached" хийнэ
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db('cj_travel');
        const users = db.collection('users');

        const userData = req.body;

        // 1. Имэйл шалгах
        const existingUser = await users.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Энэ имэйл бүртгэлтэй байна' });
        }

        // 2. Өгөгдөл оруулах (Role-оос үл хамааран шууд хадгална)
        // userData дотор role: 'Traveler', 'Guide', эсвэл 'Provider' гэж ирж байгааг шалгаарай
        const result = await users.insertOne({
            ...userData,
            createdAt: new Date()
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Амжилттай бүртгэгдлээ', 
            id: result.insertedId 
        });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ message: 'Серверийн алдаа', error: error.message });
    }
    // client.close() хийх шаардлагагүй!
}
