import "dotenv/config";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
// import { connect } from "mongoose";
import { resolvers, typeDefs } from "./graphql";
import {connectDatabase} from "./database";

async function startApolloServer(app: Application) {
  const db =  await connectDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({db})
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/api",
  });

  /*
  Mongoose Connection
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

  await connect(uri);
  console.log("MongoDB Database connected..");
  */

  const PORT = process.env.PORT || 9000;
  app.listen(PORT);

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(express());
