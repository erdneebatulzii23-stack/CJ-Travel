import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await client.connect();
        const database = client.db('cj-travel-db'); // Өөрийн DB нэрээ шалгаарай
        const users = database.collection('users');

        const { email, password } = req.body;

        // MongoDB-ээс хэрэглэгчийг имэйл болон нууц үгээр нь хайх
        const user = await users.findOne({ email, password });

        if (user) {
            // Нууц үгийг хариунд явуулахгүй байх нь аюулгүй
            const { password, ...userWithoutPassword } = user;
            return res.status(200).json(userWithoutPassword);
        } else {
            return res.status(401).json({ message: 'Имэйл эсвэл нууц үг буруу байна.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Серверт алдаа гарлаа.' });
    }
}
