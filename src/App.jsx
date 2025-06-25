import React from 'react'
import Search from './components/Search'
import { useState, useEffect } from 'react';


const API_BASE_URL = 'https://api.themoviedb.org/3';

console.log('All env vars:', import.meta.env);
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    }
}



function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllPages = async (url, allResults = [], page = 1) => {
    try {
      const response = await fetch(`${url}&page=${page}`, API_OPTIONS);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.status_message || 'Failed to fetch movies');
      }
      
      const results = data.results || [];
      const updatedResults = [...allResults, ...results];
      
      // If there are more pages, fetch the next page
      if (data.page < data.total_pages) {
        // Add a small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
        return fetchAllPages(url, updatedResults, page + 1);
      }
      
      return updatedResults;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      return allResults; // Return whatever we have so far
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      console.log('API Key:', API_KEY ? 'Present' : 'Missing');
      
      if (!API_KEY) {
        throw new Error('TMDB API key is missing. Please check your .env file');
      }

      const baseUrl = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&include_adult=false`;
      console.log('Starting to fetch movies...');
      
      const allMovies = await fetchAllPages(baseUrl);
      
      if (allMovies.length === 0) {
        throw new Error('No movies found');
      }
      
      console.log('Successfully fetched', allMovies.length, 'movies');
      setMovieList(allMovies);
      setErrorMessage('');

    } catch(error) {
      console.error('Error in fetchMovies:', error);
      setErrorMessage(`Error: ${error.message}`);
      setMovieList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern">

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Herro Banner" />
            <h1>Find <span className="text-gradient">Movies</span>, You'll Enjoy the Hassle </h1>
            <Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>

          <section className='all-movies'>
            <h2>All Movies</h2>

            {loading ? <p>Loading...</p> : <ul>
              {movieList.map(movie => (
                <li key={movie.id}>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                </li>
              ))}
            </ul>}
          </section>
       

        </div>

      </div>


    </main>
  )
}

export default App
