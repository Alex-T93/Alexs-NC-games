const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("App tests are running", () => {
  test("app.tests is running...", () => {});
});

describe("GET /api/categories", () => {
  test("200: Responds with an array of categories objects with each having the slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((categories) => {
          expect(categories).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET Error Handling", () => {
  test("404: Responds with a correct error message for an invalid get request path", () => {
    return request(app)
      .get("/api/notfound")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Not Found");
      });
  });
});