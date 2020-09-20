import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './DB/db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Subscription from './Subscription/subscription'
import prisma from './prisma'
// Scalar types - String, Boolean, Int, Float, ID

const pubsub = new PubSub()
const server = new GraphQLServer({
    typeDefs: './src/Schema/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment,
        Subscription
    },
    context: {
        db,
        pubsub,
        prisma
    }
})

server.start(() => {
    console.log('The server is up!')
})