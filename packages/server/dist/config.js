"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRAPHQL_HOST = exports.HASURA_GRAPHQL_ADMIN_SECRET = exports.STORAGE_BUCKET = exports.STORAGE_ENDPOINT = exports.STORAGE_SECRET = exports.STORAGE_KEY = void 0;
//storage
var STORAGE_KEY = process.env.STORAGE_KEY || "";
exports.STORAGE_KEY = STORAGE_KEY;
var STORAGE_SECRET = process.env.STORAGE_SECRET | "";
exports.STORAGE_SECRET = STORAGE_SECRET;
var STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "";
exports.STORAGE_ENDPOINT = STORAGE_ENDPOINT;
var STORAGE_BUCKET = process.env.STORAGE_BUCKET || ""; //hasura

exports.STORAGE_BUCKET = STORAGE_BUCKET;
var HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || "";
exports.HASURA_GRAPHQL_ADMIN_SECRET = HASURA_GRAPHQL_ADMIN_SECRET;
var GRAPHQL_HOST = process.env.GRAPHQL_HOST || "http://localhost:8080/v1/graphql";
exports.GRAPHQL_HOST = GRAPHQL_HOST;