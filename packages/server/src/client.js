import { GraphQLClient } from "graphql-request";
import { GRAPHQL_HOST, HASURA_GRAPHQL_ADMIN_SECRET } from "./config";

const client = new GraphQLClient(GRAPHQL_HOST, {
  headers: {
    "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET
  }
});

export default client;
