"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _graphqlRequest = require("graphql-request");

var _config = require("./config");

var client = new _graphqlRequest.GraphQLClient(_config.GRAPHQL_HOST, {
  headers: {
    "x-hasura-admin-secret": _config.HASURA_GRAPHQL_ADMIN_SECRET
  }
});
var _default = client;
exports["default"] = _default;