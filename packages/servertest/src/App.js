import React from "react";
import "./App.css";

async function handleUpload(file, title, poiId, year) {
  var data = new FormData();

  data.append("title", title);
  data.append("poi_id", poiId);
  data.append("year", year);
  data.append("file", file);

  return fetch("http://localhost:3000/storage/upload", {
    method: "POST",
    body: data
  }).then(response => response.json());
}

function App() {
  const [file, _file] = React.useState("");
  const [title, _title] = React.useState("");
  const [poiId, _poiId] = React.useState(93517);
  const [year, _year] = React.useState(1999);
  const [resp, _resp] = React.useState(null);
  const [submitting, _submitting] = React.useState(false);
  const [error, _error] = React.useState("");

  const load = async () => {
    const result = await handleUpload(file, title, poiId, year);
    console.log("Await data", result);
    if (result.error) {
      _error(result.error.details.map(d => d.message).join(", "));
    } else {
      _resp(result[0]);
    }
    _submitting(false);
  };

  return (
    <div className="App">
      <h1>Upload test</h1>

      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          load().then(() => {
            console.log("done");
          });
        }}
      >
        <section>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => _title(e.target.value)}
          />
        </section>
        <section>
          <label>Poi Id</label>
          <input
            type="text"
            value={poiId}
            onChange={e => _poiId(parseInt(e.target.value, 10))}
          />
        </section>
        <section>
          <label>Year</label>
          <input
            type="text"
            value={year}
            onChange={e => _year(parseInt(e.target.value, 10))}
          />
        </section>
        <section>
          <label>Choose file</label>
          <input
            type="file"
            name="file"
            onChange={e => {
              _file(e.target.files[0]);
            }}
          />
        </section>
        {error !== "" && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          Upload
        </button>
      </form>
      {resp !== null && (
        <div>
          <h3>
            {resp.poi_id}
            {resp.title}
          </h3>
          <h6>{resp.year}</h6>
          <img
            src={`http://localhost:3000/storage/file/${resp.file_key}`}
            alt="temp"
          />
        </div>
      )}
    </div>
  );
}

export default App;
