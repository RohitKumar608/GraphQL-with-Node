import { GraphQLServer } from "graphql-yoga"

// Type definitions(schema)
const typeDefs =  `
type Query {
    title: String!
    price: Int!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`
// Resolvers

const resolvers = {
  Query: {
    title() {
      return "Its About secret"
    },
    price() {
      return 54
    },
    releaseYear(){
      return null
    },
    rating(){
      return 3.2
    },
    inStock(){
      return true
    }
  },
}
const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log("Server is running on localhost:4000"))
