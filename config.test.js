const fs = require("fs");
const config = require("./config");

jest.mock("fs");

test("Should reject errors", () => {
  expect.assertions(1);

  const error = new Error("Nope");
  fs.readFile.mockImplementation((filename, options, cb) => {
    cb(error, null);
  });

  return expect(config()).rejects.toThrow(error);
});

test("Should reject if clientIdentifier is missing", () => {
  expect.assertions(1);

  const data = {
    foo: "bar"
  };
  fs.readFile.mockImplementation((filename, options, cb) => {
    cb(null, JSON.stringify(data));
  });

  return expect(config()).rejects.toThrow(
    "clientIdentifier not set in config.json"
  );
});

test("Should return config", () => {
  expect.assertions(1);

  const data = {
    clientIdentifier: "supah secret"
  };
  fs.readFile.mockImplementation((filename, options, cb) => {
    cb(null, JSON.stringify(data));
  });

  return expect(config()).resolves.toMatchObject(data);
});
