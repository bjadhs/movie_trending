import { database, appwriteConfig } from "./config";
import { ID, Query } from "appwrite";

export const getTrendingMovies = async () =>{
    try{
        const response = await database.listDocuments(
        appwriteConfig.database,
        appwriteConfig.collection,
        [Query.limit(5), Query.orderDesc('count')]    
        );
        return response;
    }catch(err){
        console.error(err);
    }
}

export const updateSearchCount = async (searchTerm, movie) =>{
    try{
        const result = await database.listDocuments(
            appwriteConfig.database,
            appwriteConfig.collection,
            [Query.equal('searchTerm', searchTerm)]
        )
        if(result.documents.length > 0){
            const doc = result.documents[0];
            if (doc) {
                const response = await database.updateDocument(
                    appwriteConfig.database,
                    appwriteConfig.collection,
                    doc.$id,
                    { count: doc.count + 1 }
                );
            }
        } else {
            const response = await database.createDocument(
                appwriteConfig.database,
                appwriteConfig.collection,
                ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            );
        }
    }catch(err){
        console.error(err);
    }
}
