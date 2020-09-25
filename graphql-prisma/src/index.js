import { GraphQLServer, PubSub } from "graphql-yoga"
import db from "./DB/db"
import prisma from "./prisma"
// Scalar types - String, Boolean, Int, Float, ID
import { resolvers, fragmentReplacements } from './resolvers/index'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs:  "./src/Schema/schema.graphql",
    resolvers,
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start(() => {
    console.log('The server is up!')
})