import { useState, useEffect } from 'react';
import {useDebounce} from 'react-use';
import { updateSearchCount } from './lib/appwrite/appwrite';
import { getTrendingMovies } from './lib/appwrite/appwrite';


  
const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
}

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trending, setTrending] = useState([]);

  useDebounce(()=> setDebouncedSearchTerm(searchTerm),1000, [searchTerm]);

  const fetchMovies = async (query='') =>{
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      console.log(data.results);
      setMovies(data.results || []);
      if(query && data.results.length > 0){
        updateSearchCount(query, data.results[0]);
      }
      // setSearchTerm('');

    }catch(error){
      setErrorMessage(`Something went wrong ${error.message}`);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(debouncedSearchTerm){
      fetchMovies(debouncedSearchTerm);
    }
  },[debouncedSearchTerm]);


  const loadTrendingMovies = async () => {
    try{
    const res = await getTrendingMovies();
    setTrending(res.documents);
    }catch(error){
      console.error(error);
    }
  }
  useEffect(() =>{
    loadTrendingMovies();
  },[debouncedSearchTerm]);

  return (
    <main className='min-h-screen relative'>
        {/* Background Image */}
        <div className='w-full h-full absolute z-0'>
          <img src='/hero-bg.png' alt='Hero Banner' width={2880} height={1640} />
        </div>

        <div className='absolute z-50 top-8 left-0 right-0 flex flex-col items-center justify-center'>
        {/* Banner */}
            <header className='mb-8 align-center'>
              <img src='/hero.png' alt='Hero' width={480} height={280} />
              <h1 className=''>Find <span className='text-gradient'>Movies</span> You Will Love Without Hassel.</h1>
              <div className='max-w-3xl bg-light-100/5 border border-gray-400 rounded-full m-4 px-3 py-2 flex items-center gap-4'>
                  <img src="search.svg" alt="search" />
                  <input className='bg-transparent placeholder-light-300 text-gray-200 outline-none' type='text' placeholder='Search Movies' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>    
            </header>
          {/* Main Content */}
            {/* Trending movies */}
            {trending.length>0 && (
            <section >
              <h2>Trending Movies</h2>
              <div className='grid grid-cols-4 gap-4'>
              {trending.map((movie) => (
                <div className='flex flex-col items-center' key={movie.$id}>
                  <div className='w-20 h-20 border border-gray-600 hover:border-indigo-400 rounded-md hover:shadow-md hover:scale-105 transform overflow-hidden cursor-pointer'>
                  <img src={
                    movie.poster_url
                  }
                    alt={movie.searchTerm}
                    className='w-full h-full object-cover'
                  />
                    </div>
                    <h2>{movie.searchTerm}</h2>
                    
                    </div>

                ))}
                </div>
            </section>
            )}
            {/* All Movies */}
            <section>
              <h2>All Movies</h2>
              <div className='grid grid-cols-4 gap-4'>
                {isLoading ?
                <p>Loading...</p> 
                : errorMessage ? <p>Something went wrong...{errorMessage}</p> 
                : movies.map((movie) => (
                  <div key={movie.id} className='w-20 h-20 border border-gray-600 hover:border-indigo-400 rounded-md hover:shadow-md hover:scale-105 transform overflow-hidden cursor-pointer'>
                  <img src={movie.poster_path ?
          `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
        alt={movie.title}
      />
                    <h3>{movie.title}</h3>
                    <p>{movie.year}</p>
                    </div>
                 
                ))}
                </div>
            </section>
        
        </div>

    </main>
  )
}

export default App