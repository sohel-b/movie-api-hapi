
'use strict';

const Hapi = require('@hapi/hapi');
const axios = require('axios');
const { genres } = require('./genres.json') 

// Replace with your TMDb API key
const apiKey = 'a7fbf2d6d727835198a74874d82cf6c8';

const init = async () => {

    const server = Hapi.server({
        port: 3333,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'] // Allow all origins
            }
        }
    });
    

    // API route to get movie data from TMDb API
    server.route({
        method: 'GET',
        path: '/api/movies/{movieName}',
        handler: async (request, h) => {
            const title = request.params.movieName;
            try {
                // Fetch movie data from TMDb
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                    params: {
                        api_key: apiKey,
                        query: title
                    }
                });

                // Return the first movie result
                if (response) {

                    // changing genre_ids into genre_names
                    for(let i of response.data.results) {
                        let movieGenre = i?.genre_ids
                            movieGenre?.forEach((id, index) => {
                            const genre = genres?.find(item => item?.id === id)
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
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
