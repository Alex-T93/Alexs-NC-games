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
        expect(msg).toBe("Invalid request: Please enter a number");
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
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0)
      });
    });
  });

describe("GET Error Handling", () => {
  test("404, responds with 'Not Found' error message when path is invalid", () => {
    return request(app)
      .get("/api/reviews/2/nocomments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("404: Responds with 'Review ID Not Found' error message when review id does not exist", () => {
    return request(app)
      .get("/api/reviews/0/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review ID Not Found");
      });
  });
});

  
describe("POST /api/reviews/:review_id/comments", () => {
  test("201: Creates a new comment and responds with the posted comment", () => {
    const comment = { username: "bainesface", body: "One of my favourie games!" };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(comment)
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment).toEqual(
          expect.objectContaining({
            comment_id: 7,
            review_id: 4,
            author: "bainesface",
            body: "One of my favourie games!",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
});
describe("POST Error Handling", () => {
  test("400: Responds with 'Bad request' error message when given an invalid ID", () => {
    const newComment = {
      username: "bainesface",
      body: "One of my favourie games!",
    };
    return request(app)
      .post("/api/reviews/nanid/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: Responds with 'Bad Request: Please enter a username' error message when the comment contains no body", () => {
    const newComment = {
      username: "",
      body: "One of my favourie games!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Please enter a username");
      });
  });
  test("400: Responds with 'Bad request: Enter a valid comment' error message when the comment contains no body", () => {
    const newComment = {
      username: "bainesface",
      body: "",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Enter a valid comment");
      });
  });
  test("400: Responds with 'Bad request: Incorrect valid data type' error message when incorrect data type is provieded for the comment", () => {
    const newComment = {
      username: "bainesface",
      body: 2,
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Incorrect valid data type");
      });
  });
  test("400: Responds with 'Bad request: Username does not exist' when incorrect username", () => {
    const newComment = {
      username: "not_a_username",
      body: "One of my favourie games!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Username does not exist");
      });
  });
});


describe("GET /GET /api/reviews (queries)", () => {
  test("200: Responds with an reviews object sorted by title in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: Responds with an reviews object sorted by designer in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toBeSortedBy("designer", { ascending: true });
      });
  });
  test("200: Responds with an reviews object filter by the category of social deduction", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(11);
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            created_at: expect.any(String),
            category: "social deduction",
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Responds with an reviews object filtered by the category of dexterity", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            created_at: expect.any(String),
            category: "dexterity",
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with an reviews object sorted by the review id in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=desc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("review_id", {
          descending: true,
        });
      });
  });
  test("200: Responds with an reviews object sorted by comment count in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("comment_count", { ascending: true });
      });
  });
});

describe("DELETE  /api/comments/:comment_id", () => {
  test("204: Deletes the comment ", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("DELETE  Error Handling", () => {
  test("400: Responds with 'Bad request' message when provided invalid delete path", () => {
    return request(app)
      .delete("/api/comments/no_comment_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: Responds with 'Bad request: No comment to delete' message when provided invalid delete path", () => {
    return request(app)
      .delete("/api/comments/200")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: No comment to delete");
      });
  });
});

describe.only("/api", () => {
  test("200: Responds with a JSON object describing all available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toBeInstanceOf(Object);
        expect(Object.keys(endpoints)).toHaveLength(9);
        expect(endpoints["GET /api"].description).toBe(
          "Serves up a json representation of all the available endpoints of the api"
        );
        expect(endpoints["GET /api/categories"].queries).toEqual([]);
        expect(endpoints["GET /api/reviews"].queries).toEqual([
          "category",
          "sort_by",
          "order",
        ]);
        expect(endpoints["DELETE /api/comments/:comment_id"].description).toBe(
          "Deletes a comment for a specified comment id and serves no content with 204 status status code"
        );
        expect(
          endpoints["DELETE /api/comments/:comment_id"].exampleResponse
        ).toEqual({});
      });
  });
});