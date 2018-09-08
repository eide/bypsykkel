const express = require("express");
const api = require("./api");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  api.get().then(stations => {
    res.render("index", {
      stations
    });
  });
});

app.listen(3000, () => console.log("Running on http://localhost:3000/"));
