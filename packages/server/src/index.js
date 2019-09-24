import "./config";
import express from "express";
import storage from "./storage";
import morgan from "morgan";
import cors from "cors";
import chalk from "chalk";
import data from "./data";

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("public"));

//routes
app.use("/storage", storage);
app.use("/data", data);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    console.error(err.message);
    console.error(err.stack);
    return res.status(500);
  }
});

const server = app.listen(app.get("port"), () => {
  console.log(
    "Server running at http://localhost:%s in %s mode",
    chalk.cyan(app.get("port")),
    chalk.magenta(app.get("env"))
  );
  console.log(`  Press ${chalk.green("CTRL-C")} to stop\n`);
});

export default server;
