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
  test("200: Responds with an objects containing correct keys", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_body: "Fiddly fun for all the family",
            review_id: 2,
            review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            title: "Jenga",
            votes: 5,
            comment_count: 3
          })
        );
      });
  })
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
  test("404: Responds with 'Review ID Not Found' error message for an invalid id that does not exist", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Review ID Not Found");
      });
  });
});


describe("PATCH /api/reviews/:review_id", () => {
  test("200: Responds with an reviews object with the votes updated correctly", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body: { updated_review } }) => {
        expect(updated_review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 101
          })
        );
      });
  });
});

describe("PATCH /api/reviews/:review_id - Error Handling", () => {
  test("404: Responds with 'Review ID Not Found' error message for an invalid id that does not exist", () => {
    return request(app)
      .patch("/api/reviews/500")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Review ID Not Found");
      });
  });
  test("400: Responds with 'Bad request' error message for an invalid patch request path", () => {
    return request(app)
      .patch("/api/reviews/badpath")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });

  test("400, Responds with 'Invalid Request' error message when passed an object that does  have a 'inc_votes' property with the incorrect value", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "dog" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Request: Please enter a number");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of objects, with username, name,avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((users) => {
          expect(users).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
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

describe("GET /api/reviews/", () => {
  test("200: Responds with an reviews object sorted by the creation date in descending order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSorted("created_at", { descending: true });
        expect(reviews).toHaveLength(13)
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Responds with reviews object sorted by the date created in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSorted("created_at", { descending: true });
      });
  });

});
describe("GET Error Handling", () => {
  test("400: Responds with Invalid request:  Enter a valid sort by or order error message for an invalid sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=incorrectquery")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual(
          "Invalid request: Enter a valid sort_by query"
        );
      });
  });
  test("400: Responds with 'Invalid request:  Enter a valid sort by or order' error message for an invalid order query", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at&order=incorrectrder")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual(
          "Invalid request: Enter a valid order query"
        );
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: Responds with an array of comment objects for the input review id containing the correct properties", () => {
    return request(app)
    .get("/api/reviews/3/comments")
    .expect(200)
    .then(({body}) => {
      expect(body.comments).toBeInstanceOf(Array);
      expect(body.comments).toHaveLength(3)
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id:expect.any(Number),
          votes: expect.any(Number),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body:expect.any(String)
        });
      });
    });
  });
  test("200: Responds with an empty array when an review id exists but has no comments", () => {
      return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({body: { comments }}) => {
        console.log(comments)
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0)
      });
    });
  });

describe("GET /api/reviews/:review_id/comments - Error Handling", () => {
  test("404, responds with 'Not Found' error message when path is invalid", () => {
    return request(app)
      .get("/api/reviews/2/nocomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("404: Responds with 'Review ID Not Found' error message when article id does not exist", () => {
    return request(app)
      .get("/api/reviews/0/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review ID Not Found");
      });
  });
});

  
  