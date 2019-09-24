import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import uuidv4 from "uuid/v4";
import AWS from "aws-sdk";
import Boom from "boom";
import mime from "mime-types";
import joi from "joi";
import client from "./client";

import {
  STORAGE_KEY,
  STORAGE_SECRET,
  STORAGE_ENDPOINT,
  STORAGE_BUCKET
} from "./config";

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: STORAGE_KEY,
  secretAccessKey: STORAGE_SECRET,
  endpoint: STORAGE_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

const schema = joi.object().keys({
  poi_id: joi.number().required(),
  title: joi.string().required(),
  year: joi.number().required(),
  email: joi.string(),
  author: joi.string()
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: STORAGE_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname
      });
    },
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    fileFilter: (req, file, cb) => {
      const { error, values } = schema.validate(req.body);
      if (error) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    },
    key: (req, file, cb) => {
      const uuid = uuidv4();
      const extension = mime.extension(file.mimetype);
      const key = `${uuid}.${extension}`;

      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key,
        extension
      });
      cb(null, key);
    }
  })
});

const upload_auth = (req, res, next) => {
  req.saved_files = [];
  next();
};

router.get("/file/*", (req, res, next) => {
  const key = `${req.params[0]}`;

  const params = {
    Bucket: STORAGE_BUCKET,
    Key: key
  };

  s3.headObject(params, function(err, data) {
    if (err) {
      console.error(err);
      if (err.code === "NotFound") {
        return next(Boom.notFound());
      }
      return next(Boom.badImplementation("Unable to retreive file"));
    }

    const stream = s3.getObject(params).createReadStream();

    // forward errors
    stream.on("error", function error(err) {
      console.error(err);
      return next(Boom.badImplementation());
    });

    //Add the content type to the response (it's not propagated from the S3 SDK)
    res.set("Content-Type", data.ContentType);
    res.set("Content-Length", data.ContentLength);
    res.set("Last-Modified", data.LastModified);
    res.set(
      "Content-Disposition",
      `inline; filename="${data.Metadata.originalname}"`
    );
    res.set("Cache-Control", "public, max-age=31557600");
    res.set("ETag", data.ETag);

    // stream.on('end', () => {
    //     console.log('Served by Amazon S3: ' + key);
    // });

    //Pipe the s3 object to the response
    stream.pipe(res);
  });
});

router.post(
  "/upload",
  upload_auth,
  upload.single("file"),
  async (req, res, next) => {
    //req.saved_files;
    let file_key = req.saved_files[0].key;

    const d = await update(file_key, req.body);
    if (d) {
      res.json(d);
    } else {
      res.statusCode(500);
    }
  }
);

const PHOTO_MUTATION = `
  mutation PhotoInsert($objects: [photo_upload_insert_input!]!) {
    insert_photo_upload(objects: $objects) {
      returning {
        id
        file_key
        author
        created_at
        email
        poi_id
        title
        year
      }
    }
  }
`;

async function update(file_key, values) {
  let object = {
    file_key,
    poi_id: values.poi_id,
    title: values.title,
    year: parseInt(values.year, 10)
  };

  if (values.email) object.email = values.email;
  if (values.author) object.author = values.author;

  try {
    const result = await client.request(PHOTO_MUTATION, {
      objects: [object]
    });
    if (result && result.insert_photo_upload) {
      return result.insert_photo_upload.returning;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default router;
