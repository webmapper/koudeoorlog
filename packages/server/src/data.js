import express from "express";
import fetch from "isomorphic-unfetch";
import client from "./client";

const POI_MUTATION = `
  mutation InsertPoi($objects: [poi_insert_input!]!) {
    insert_poi(objects:$objects, on_conflict: {constraint: poi_pkey, update_columns: [class, description, name, lat, lng, situation]}) {
      affected_rows
    }
  }
`;

const router = express.Router();

router.get("/load", async (req, res) => {
  let url = req.query.url;

  const objects = await fetch(url)
    .then(resp => resp.json())
    .then(json => {

      return json.features.map(f => ({
        id: f.properties.id,
        class: f.properties.KLASSE2,
        situation: f.properties.SITUATIE,
        name: f.properties.NAAM,
        description: f.properties.BESCHRIJVING,
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      }));
    });

  try {
    const result = await client.request(POI_MUTATION, {
      objects
    });
    if (result && result.insert_poi.affected_rows) {
      res.json({
        affected_rows: result.insert_poi.affected_rows
      });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
