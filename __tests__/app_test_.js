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

describe("GET /api/reviews/:review_id", () => {
  test("200: Responds with an objects containing (review_id, title, review_body, designer, review_img_url, votes(with a defalut of 0), category , owner, created_at defaults to the current timestam", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: 'Agricola',
            category: 'euro game',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_body: 'Farmyard fun!',
            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1
            })
        );
      });
  });
});

describe("GET /api/reviews/:review_id - Error Handling", () => {
  test("400: Responds with 'Bad request' error message for an invalid get request path", () => {
    return request(app)
      .get("/api/reviews/badPath")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });
  test("404: Responds with 'Article ID Not Found' error message for an invalid id that does not exist", () => {
    return request(app)
      .get("/api/reviews/30")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Review ID Not Found");
      });
  });
});