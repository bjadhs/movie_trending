import {Client} from 'appwrite';
import {Databases} from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

 const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    project: PROJECT_ID,
    database: DATABASE_ID,
    collection: COLLECTION_ID
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.project);
    

 const database = new Databases(client);
export {appwriteConfig, database};