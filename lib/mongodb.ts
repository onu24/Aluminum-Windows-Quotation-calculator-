import { MongoClient, Db } from 'mongodb';

const options = {
  tls: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGO_DB_URL) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const uri: string = process.env.MONGO_DB_URL;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

// Create a proxy object that looks like a Promise but lazily creates the actual promise
const lazyClientPromise = new Proxy({} as Promise<MongoClient>, {
  get(_target, prop) {
    const promise = getClientPromise();
    const value = (promise as any)[prop];
    if (typeof value === 'function') {
      return value.bind(promise);
    }
    return value;
  }
});

export default lazyClientPromise;
