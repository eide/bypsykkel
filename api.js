const fetch = require("node-fetch");
const config = require("./config");

function bikeFetch(path) {
  return config()
    .then(config =>
      fetch(`https://oslobysykkel.no/api/v1/${path}`, {
        headers: { "Client-Identifier": config.clientIdentifier }
      })
    )
    .catch(err => {
      console.error(
        'Could not read config. Please rename "config.json.example" and add your client identifier.',
        err
      );
      throw err;
    });
}

function getStations() {
  return bikeFetch("stations")
    .then(res => res.json())
    .then(data => data.stations)
    .catch(err => {
      throw new Error("getStations failed. Is clientIdentifer set in config?");
    });
}

function getAvailability() {
  return bikeFetch("stations/availability")
    .then(res => res.json())
    .then(data =>
      data.stations.reduce(
        (acc, curr) => acc.set(curr.id, curr.availability),
        new Map()
      )
    )
    .catch(err => {
      throw new Error(
        "getAvailability failed. Is clientIdentifer set in config?"
      );
    });
}

function get() {
  return Promise.all([getStations(), getAvailability()])
    .then(([stations, availabilityMap]) =>
      stations.map(station => {
        const availability = availabilityMap.get(station.id, {
          bikes: -1,
          locks: -1
        });
        return {
          ...station,
          ...availability
        };
      })
    )
    .catch(err => {
      console.error("Something went wrong", err);
      return [];
    });
}

module.exports = {
  get
};