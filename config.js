const fs = require("fs");

let config = null;

function readConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile("./config.json", { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        newConfig = JSON.parse(data);
        if (!newConfig.clientIdentifier) {
          reject("clientIdentifer not set in config.json");
        } else {
          config = newConfig;
          resolve(config);
        }
      }
    });
  });
}

module.exports = function getConfig() {
  if (!config) {
    return readConfig();
  }
  return Promise.resolve(config);
};
