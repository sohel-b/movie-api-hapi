// const { genres } = require('../../genres.json')
import genres from '../../genres.json' assert { type: 'json' };
import axios from 'axios'
// TMDB API KEY
const moviesApiKey = 'a7fbf2d6d727835198a74874d82cf6c8';

// TMDB base URL
const BASE_URL = 'https://api.themoviedb.org/3'

// NEWS API KEY
const newsApiKey = '9fdf959c5cac4dbf860fe388f511148b';


// API route to get movie data from TMDb API
export const moviesApiCall = {
    method: 'GET',
    path: '/api/movies/{movieName}',
    handler: async (request, h) => {
        try {
            // Fetch movie data from TMDb
            const title = request.params.movieName;
            const response = await axios.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: moviesApiKey,
                    query: title
                }
            });

            // Return the first movie result
            if (response) {
                // changing genre_ids into genre_names
                for (let i of response.data.results) {
                    let movieGenre = i?.genre_ids
                    movieGenre?.forEach((id, index) => {
                        const genre = genres?.genres?.find(item => item?.id === id)
                        movieGenre[index] = genre?.name
                    })
                }

                let result = response.data.results;
                return result
            } else {
                return h.response({ error: 'Movie not found' }).code(404);
            }

        } catch (error) {
            console.error(error);
            return h.response({ error: 'Unable to fetch movie data' }).code(500);
        }
    }
}

export const trendingMovies = {
    method: 'GET',
    path: '/api/trending',
    handler: async (request, h) => {
        try {
            const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
                params: {
                    api_key: moviesApiKey,
                }
            });
            if (response) {
                // changing genre_ids into genre_names
                for (let i of response.data.results) {
                    let movieGenre = i?.genre_ids
                    movieGenre?.forEach((id, index) => {
                        const genre = genres?.genres?.find(item => item?.id === id)
                        movieGenre[index] = genre?.name
                    })
                }

                let result = response.data.results;
                return result
            } else {
                return h.response({ error: 'Movie not found' }).code(404);
            }
        } catch (error) {
            console.error(error)
            return h.response({error: "Unable to fetch Trending Movies"}).code(500)
        }
    }
}

export const movieCastDetails = {
    method: 'GET',
    path: `/api/cast`,
    handler: async (request, h) => {
        try {
            const movieId = request.query.movieId;
            const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
                params: {
                    api_key: moviesApiKey,
                }
            })
            return response.data
        } catch (error) {
            console.error(error)
            return h.response({error: "Unable to fetch Cast For Movie"}).code(500)
        }
    }
}

export const similarMovies = {
    method: 'GET',
    path: `/api/similarMovies`,
    handler: async (request, h) => {
        try {
            const movieId = request.query.movieId
            const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
                params: {
                    api_key: moviesApiKey,
                }
            })
            if (response) {
                // changing genre_ids into genre_names
                for (let i of response.data.results) {
                    let movieGenre = i?.genre_ids
                    movieGenre?.forEach((id, index) => {
                        const genre = genres?.genres?.find(item => item?.id === id)
                        movieGenre[index] = genre?.name
                    })
                }

                let result = response.data.results;
                return result
            }
        } catch(error) {
            console.error(error)
            return h.response({error: "Unable to fetch Cast For Movie"}).code(500)
        }
    }
}

export const newsApiCall = {
    method: 'GET',
    path: '/api/news/{topic}',
    handler: async (request, h) => {
        try {
            const topic = request.params.topic
            const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {                // change "top-headlines" to "everything"
                headers: {
                    'X-Api-Key': newsApiKey,
                },
                params: {
                    q: topic,
                }
            })
            const articles = response?.data?.articles?.slice(0, 10);
            console.log('Top Headlines:', articles);
            return articles
        } catch (error) {
            console.error(error);
            return h.response({ error: 'Unable to fetch news' }).code(500)
        }
    }

}
