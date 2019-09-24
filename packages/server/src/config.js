//storage
export const STORAGE_KEY = process.env.STORAGE_KEY || "";
export const STORAGE_SECRET = process.env.STORAGE_SECRET | "";
export const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "";
export const STORAGE_BUCKET = process.env.STORAGE_BUCKET || "";

//hasura
export const HASURA_GRAPHQL_ADMIN_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET || "";
export const GRAPHQL_HOST =
  process.env.GRAPHQL_HOST || "http://localhost:8080/v1/graphql";
