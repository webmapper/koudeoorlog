"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _isomorphicUnfetch = _interopRequireDefault(require("isomorphic-unfetch"));

var _client = _interopRequireDefault(require("./client"));

var POI_MUTATION = "\n  mutation InsertPoi($objects: [poi_insert_input!]!) {\n    insert_poi(objects:$objects, on_conflict: {constraint: poi_pkey, update_columns: [class, description, lat, lng, situation]}) {\n      affected_rows\n    }\n  }\n";

var router = _express["default"].Router();

router.get("/load",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var url, objects, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = req.query.url;
            _context.next = 3;
            return (0, _isomorphicUnfetch["default"])(url).then(function (resp) {
              return resp.json();
            }).then(function (json) {
              return json.features.map(function (f) {
                return {
                  id: f.properties.id,
                  "class": f.properties.KLASSE2,
                  situation: f.properties.SITUATIE,
                  description: f.properties.BESCHRIJVING,
                  lng: f.geometry.coordinates[0],
                  lat: f.geometry.coordinates[1]
                };
              });
            });

          case 3:
            objects = _context.sent;
            _context.prev = 4;
            _context.next = 7;
            return _client["default"].request(POI_MUTATION, {
              objects: objects
            });

          case 7:
            result = _context.sent;

            if (result && result.insert_poi.affected_rows) {
              res.json({
                affected_rows: result.insert_poi.affected_rows
              });
            }

            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);
            res.sendStatus(500);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;