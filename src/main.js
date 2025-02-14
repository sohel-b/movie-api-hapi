
'use strict';

// const Hapi = require('@hapi/hapi');
import Hapi from "@hapi/hapi"
// const { moviesApiCall, trendingMovies, movieCastDetails, similarMovies, newsApiCall } = require('./routes/apiCalls/index.js');
import { moviesApiCall, trendingMovies, movieCastDetails, similarMovies, newsApiCall } from './routes/apiCalls/index.js'
// const { getLogin, createLogin } = require('./routes/mongoDbCalls/index.js');
import {getLogin, createLogin } from "./routes/mongoDbCalls/index.js"

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
    
    // MongoDb Calls
    server.route(getLogin)
    server.route(createLogin)

    // API calls
    server.route(moviesApiCall);
    server.route(trendingMovies)
    server.route(movieCastDetails)
    server.route(similarMovies)
    server.route(newsApiCall)

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
