const fetch = require("node-fetch");
const api = require("./api");
const config = require("./config");

jest.mock("./config");
jest.mock("node-fetch");

const stationData = {
  stations: [
    {
      id: 1,
      name: "GOTTA GO FAST"
    }
  ]
};

const availabilityData = {
  stations: [
    {
      id: 1,
      availability: {
        bikes: 1000,
        locks: 2000
      }
    }
  ]
};

beforeEach(() => {
  config.mockResolvedValue({ clientIdentifier: "test" });
  fetch.mockImplementation(url => {
    const data = url.endsWith("availability") ? availabilityData : stationData;
    return {
      json: () => Promise.resolve(data)
    };
  });
});

describe("bikeFetch", () => {
  test("should fail with bad config", () => {
    expect.assertions(1);

    const error = new Error("Config err");
    config.mockRejectedValue(error);

    return expect(api._test.bikeFetch("foo")).rejects.toThrow(error);
  });

  test("should return", () => {
    expect.assertions(1);
    return expect(api._test.bikeFetch("foo")).resolves.toMatchObject(
      stationData
    );
  });
});

describe("getStations", () => {
  test("should fetch", () => {
    expect.assertions(1);
    return expect(api._test.getStations()).resolves.toEqual(
      stationData.stations
    );
  });

  test("should reject", () => {
    expect.assertions(1);
    const error = new Error("parse error");
    fetch.mockResolvedValue({
      json: () => Promise.reject(error)
    });
    return expect(api._test.getStations()).rejects.toThrow(error);
  });
});

describe("getAvailability", () => {
  test("should return map", () => {
    expect.assertions(1);
    return expect(api._test.getAvailability()).resolves.toEqual(
      expect.any(Map)
    );
  });
});

describe("get", () => {
  test("should gracefully fail", () => {
    expect.assertions(1);
    config.mockRejectedValue(new Error("AW NO"));
    return expect(api.get()).resolves.toEqual([]);
  });

  test("should return some nice data", () => {
    expect.assertions(1);
    return expect(api.get()).resolves.toEqual([
      {
        id: 1,
        name: "GOTTA GO FAST",
        bikes: 1000,
        locks: 2000
      }
    ]);
  });
});
