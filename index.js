import { makeAugmentedSchema } from 'neo4j-graphql-js'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { v1 as neo4j } from 'neo4j-driver'
import { typeDefs, resolvers } from './schema'

const schema = makeAugmentedSchema({
  typeDefs,
  config: {
    query: true,
    mutation: false
  }
})

const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687'
const neo4jUser = process.env.NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.NEO4J_PASSWORD || 'neo4j'

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword))

const app = express()
app.use(bodyParser.json())
app.use(cors())

const playgroundEndpoint = '/graphql'

const server = new ApolloServer({
  schema,
  resolvers,
  context: ({ req }) => {
    return {
      driver,
      req,
    }
  },
  introspection: true,
  playground: {
    endpoint: playgroundEndpoint,
    settings: {
      'editor.theme': 'light'
    }
  }
})

server.applyMiddleware({ app, path: '/' })

app.listen(4000, () => {
  console.log(`http://localhost:4000/graphql`)
})
