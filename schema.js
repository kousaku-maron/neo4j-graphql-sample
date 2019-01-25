import { neo4jgraphql } from 'neo4j-graphql-js'

export const typeDefs = `
  type Article {
    _id: ID
    uuid: ID!
    title: String!
    description: String!
    created_at: Date!
    write_user: User @relation(name: "WRITE", direction: "IN")
  }

  type User {
    _id: ID
    uuid: ID!
    name: String!
    created_at: Date!
    write_articles: [Article] @relation(name: "WRITE", direction: "OUT")
  }

  type Query {
    Article(_id: ID, title: String, description: String, created_at: Date): [Article]
    User(_id: ID, uid: ID, name: String, avatar: String, created_at: Int): [User]
  }

  type Mutation {
    writeArticle(title: String!, description: String! user_uuid: ID!): Article
      @cypher(statement:"MATCH (u:User {uuid: $user_uuid}) MERGE (u)-[r:WRITE]->(n:Article {uuid: apoc.create.uuid(), title: $title, description: $description, created_at: apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms')}) return n")

    createUser(name: String!): User
      @cypher(statement:"CREATE (n:User {uuid: apoc.create.uuid(), name: $name, created_at: apoc.date.format(apoc.date.add(timestamp(), 'ms', 9, 'h'), 'ms')}) return n")
  }
`

export const resolvers = {
  Query: {
    Article(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    User(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
  },
  Mutation: {
    writeArticle(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
    createUser(obj, args, ctx, info) {
      return neo4jgraphql(obj, args, ctx, info)
    },
  }
}
