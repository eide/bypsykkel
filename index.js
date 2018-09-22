const express = require("express");
const api = require("./api");
const config = require("./config");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('static'));

app.get("/", (req, res) => {
  Promise.all([config(), api.get()]).then(([cfg, stations]) => {
    res.render("index", {
      stations,
      mapsApiKey: cfg.mapsApiKey,
    });
  });
});

app.listen(3000, () => console.log("Running on http://localhost:3000/"));
