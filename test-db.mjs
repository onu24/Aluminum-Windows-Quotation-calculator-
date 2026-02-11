import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const uri = process.env.MONGO_DB_URL;
if (!uri) {
    console.error('MONGO_DB_URL not found in .env.local');
    process.exit(1);
}

const options = {
    tls: true,
    tlsAllowInvalidCertificates: true, // DEBUG
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

async function testConnection() {
    console.log('Attempting to connect to MongoDB (DEBUG: allow invalid certs)...');

    const client = new MongoClient(uri, options);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        const db = client.db('window_quotation');
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
    } catch (error) {
        console.error('Connection failed:');
        console.error(error);
    } finally {
        await client.close();
    }
}

testConnection();
