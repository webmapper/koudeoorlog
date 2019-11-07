"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _boom = _interopRequireDefault(require("boom"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _joi = _interopRequireDefault(require("joi"));

var _client = _interopRequireDefault(require("./client"));

var _config = require("./config");

var router = _express["default"].Router();

var s3 = new _awsSdk["default"].S3({
  accessKeyId: _config.STORAGE_KEY,
  secretAccessKey: _config.STORAGE_SECRET,
  endpoint: _config.STORAGE_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

var schema = _joi["default"].object().keys({
  poi_id: _joi["default"].number().required(),
  title: _joi["default"].string().required(),
  year: _joi["default"].number().required(),
  email: _joi["default"].string(),
  author: _joi["default"].string()
});

var upload = (0, _multer["default"])({
  storage: (0, _multerS["default"])({
    s3: s3,
    bucket: _config.STORAGE_BUCKET,
    metadata: function metadata(req, file, cb) {
      cb(null, {
        originalname: file.originalname
      });
    },
    contentType: function contentType(req, file, cb) {
      cb(null, file.mimetype);
    },
    fileFilter: function fileFilter(req, file, cb) {
      var _schema$validate = schema.validate(req.body),
          error = _schema$validate.error,
          values = _schema$validate.values;

      if (error) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    },
    key: function key(req, file, cb) {
      var uuid = (0, _v["default"])();

      var extension = _mimeTypes["default"].extension(file.mimetype);

      var key = "".concat(uuid, ".").concat(extension);
      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key: key,
        extension: extension
      });
      cb(null, key);
    }
  })
});

var upload_auth = function upload_auth(req, res, next) {
  req.saved_files = [];
  next();
};

router.get("/file/*", function (req, res, next) {
  var key = "".concat(req.params[0]);
  var params = {
    Bucket: _config.STORAGE_BUCKET,
    Key: key
  };
  s3.headObject(params, function (err, data) {
    if (err) {
      console.error(err);

      if (err.code === "NotFound") {
        return next(_boom["default"].notFound());
      }

      return next(_boom["default"].badImplementation("Unable to retreive file"));
    }

    var stream = s3.getObject(params).createReadStream(); // forward errors

    stream.on("error", function error(err) {
      console.error(err);
      return next(_boom["default"].badImplementation());
    }); //Add the content type to the response (it's not propagated from the S3 SDK)

    res.set("Content-Type", data.ContentType);
    res.set("Content-Length", data.ContentLength);
    res.set("Last-Modified", data.LastModified);
    res.set("Content-Disposition", "inline; filename=\"".concat(data.Metadata.originalname, "\""));
    res.set("Cache-Control", "public, max-age=31557600");
    res.set("ETag", data.ETag); // stream.on('end', () => {
    //     console.log('Served by Amazon S3: ' + key);
    // });
    //Pipe the s3 object to the response

    stream.pipe(res);
  });
});
router.post("/upload", upload_auth, upload.single("file"),
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var file_key, d;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //req.saved_files;
            file_key = req.saved_files[0].key;
            _context.next = 3;
            return update(file_key, req.body);

          case 3:
            d = _context.sent;

            if (d) {
              res.json(d);
            } else {
              res.statusCode(500);
            }

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
var PHOTO_MUTATION = "\n  mutation PhotoInsert($objects: [photo_upload_insert_input!]!) {\n    insert_photo_upload(objects: $objects) {\n      returning {\n        id\n        file_key\n        author\n        created_at\n        email\n        poi_id\n        title\n        year\n      }\n    }\n  }\n";

function update(_x4, _x5) {
  return _update.apply(this, arguments);
}

function _update() {
  _update = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(file_key, values) {
    var object, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            object = {
              file_key: file_key,
              poi_id: values.poi_id,
              title: values.title,
              year: parseInt(values.year, 10)
            };
            if (values.email) object.email = values.email;
            if (values.author) object.author = values.author;
            _context2.prev = 3;
            _context2.next = 6;
            return _client["default"].request(PHOTO_MUTATION, {
              objects: [object]
            });

          case 6:
            result = _context2.sent;

            if (!(result && result.insert_photo_upload)) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", result.insert_photo_upload.returning);

          case 9:
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](3);
            console.error(_context2.t0);
            return _context2.abrupt("return", null);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 11]]);
  }));
  return _update.apply(this, arguments);
}

var _default = router;
exports["default"] = _default;