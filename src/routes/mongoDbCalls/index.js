import { MongoClient } from 'mongodb';
// const { MongoClient } = require("mongodb")

const uri = 'mongodb+srv://myAtlasDBUser:Sohel2001@myatlasclusteredu.am1dh.mongodb.net/';
const client = new MongoClient(uri);

const connectToMongoDB = async (data, method) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');

    const db = client.db('loginData');
    console.log('Database:', db.databaseName);

    const collections = await db.collection("LoginDetails")

    if(method === "get") {
        const result = await collections.findOne({name: data})
        return result
    } else if (method === "post") { 
        const result = await collections.insertOne(data)
        return result
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}


export const getLogin = {
    method: "GET",
    path: "/login",
    handler: async (request, h) => {
        try {
            const name = request.query.name
            const password = request.query.password
            const method = request.method
            let response = await connectToMongoDB(name, method);
            if(response === null) {
                return {message: "User Not Found"}
            } else {
                if(password === response.password) {
                    return response
                } else {
                    return {message: "Invalid password"}
                }
            }
        } catch(error) {
            console.log(error, 'Error in mongoDbCall');
        }
    }
}

export const createLogin = {
    method: "POST",
    path: "/create/login",
    handler: async (request, h) => {
        try {
            const payload = request.payload
            const method = request.method
            let response = await connectToMongoDB(payload, method);
            return response
        } catch(error) {
            console.log(error, 'Error in mongoDbCall');
        }
    }
}