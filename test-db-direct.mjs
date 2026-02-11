import { MongoClient } from 'mongodb';

// Direct host from nslookup
const directUri = 'mongodb://ayan25005_db_user:e0Aqi9Kx0ZqNNu7o@cluster0-shard-00-02.g3lwmc2.mongodb.net:27017/window_quotation?authSource=admin&replicaSet=atlas-xxxx-shard-0&tls=true';

const options = {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
};

async function testConnection() {
    console.log('Attempting DIRECT connection to shard node...');

    const client = new MongoClient(directUri, options);

    try {
        await client.connect();
        console.log('Successfully connected directly!');
        const collections = await client.db('window_quotation').listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (error) {
        console.error('Direct connection failed:');
        console.error(error);
    } finally {
        await client.close();
    }
}

testConnection();
