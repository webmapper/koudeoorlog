import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  process.env.GRAPHQL_HOST || "http://localhost:8080/v1/graphql",
  {
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET || ""
    }
  }
);

export default client;
