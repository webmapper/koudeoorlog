"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("./config");

var _express = _interopRequireDefault(require("express"));

var _storage = _interopRequireDefault(require("./storage"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _chalk = _interopRequireDefault(require("chalk"));

var _data = _interopRequireDefault(require("./data"));

var app = (0, _express["default"])();
app.set("port", process.env.PORT || 3000);
app.use(_express["default"].json());
app.use((0, _morgan["default"])("tiny"));
app.use((0, _cors["default"])());
app.use(_express["default"]["static"]("public")); //routes

app.use("/storage", _storage["default"]);
app.use("/data", _data["default"]);
app.use(function (err, req, res, next) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return res.status(err.output.statusCode || 500).json(err.output.payload);
  }
});
var server = app.listen(app.get("port"), function () {
  console.log("Server running at http://localhost:%s in %s mode", _chalk["default"].cyan(app.get("port")), _chalk["default"].magenta(app.get("env")));
  console.log("  Press ".concat(_chalk["default"].green("CTRL-C"), " to stop\n"));
});
var _default = server;
exports["default"] = _default;