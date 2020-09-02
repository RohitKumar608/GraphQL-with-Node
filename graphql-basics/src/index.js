import { GraphQLServer } from 'graphql-yoga'
import db from './DB/db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
// Scalar types - String, Boolean, Int, Float, ID


const server = new GraphQLServer({
    typeDefs: './src/Schema/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})