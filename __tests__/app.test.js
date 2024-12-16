const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const testData = require("../db/data/test-data");
require("jest-sorted");

/* Set up your test imports here */
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});
/* Set up your beforeEach & afterAll functions here */

describe("GET/api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET/api/topics", () => {
  test("200: sends an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET/api/articles", () => {
  test("200: sends an array of all the articles in the database", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: sends an array of articles in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: sends articles do not contain body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: send articles by descending order by author name", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });

  test("200: send articles with both sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });

  test("200: Return articles by the given topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach(({ topic }) => {
          expect(topic).toBe("cats");
        });
      });
  });

  test("200: return with no articles for that topic query", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });

  test("400: Return error msg if non-valid sort_by query entered", () => {
    return request(app)
      .get("/api/articles?sort_by=NonValidCode")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Return error msg if non-valid order query entered", () => {
    return request(app)
      .get("/api/articles?order=NonValidCode")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("404: Return error message if given a topic that doesn''t exist in the database", () => {
    return request(app)
      .get("/api/articles?topic=NonExistTopic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: sends an article with a specific requested id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404: Error message of non existing ID", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });

  test("400: Error message of an invalid ID", () => {
    return request(app)
      .get("/api/articles/notid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article/comments", () => {
  test("200: sends all the comments of specific article", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([
          {
            comment_id: 15,
            body: "I am 100% sure that we're not completely sure.",
            votes: 1,
            author: "butter_bridge",
            article_id: 5,
            created_at: "2020-11-24T00:08:00.000Z",
          },
          {
            comment_id: 14,
            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
            votes: 16,
            author: "icellusedkars",
            article_id: 5,
            created_at: "2020-06-09T05:00:00.000Z",
          },
        ]);
      });
  });

  test("200: return an array in descending order by date created", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("400: send an error when article id is invalid", () => {
    return request(app)
      .get("/api/articles/NotID/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404:sends an error when article ID doesn''t exist in the database", () => {
    return request(app)
      .get("/api/articles/555/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Message of a posted comment for a specific article", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge",
        body: "New comment",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "New comment",
          created_at: expect.any(String),
          votes: 0,
          author: "butter_bridge",
          article_id: 5,
        });
      });
  });

  test("400: sends an error if comment posted without a username", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "New comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please add username");
      });
  });

  test("400: sends an error if comment posted without a body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please add body");
      });
  });

  test("400: send an error when article id is invalid", () => {
    return request(app)
      .post("/api/articles/NotID/comments")
      .send({
        username: "butter_bridge",
        body: "New comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404:sends an error when article ID doesn''t exist in the database", () => {
    return request(app)
      .post("/api/articles/555/comments")
      .send({
        username: "butter_bridge",
        body: "New comment",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });

  test("400: sends an error if body provided is not a string", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge",
        body: 999,
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("400: sends an error if body and username both are empty", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: {},
        body: {},
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Message of a updated article for a specific article_id if given positive integer", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(20);
      });
  });

  test("200: Message of a updated article for a specific article if given negative integer", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: -20 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(-20);
      });
  });

  test("400: sends an error if not given a valid number", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: "not a number" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("400: sends an error if given an empty object", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({ inc_votes: {} })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("400: sends an error if given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/NotID")
      .send({ inc_votes: 20 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("404: sends an error if given a non-existing article_id", () => {
    return request(app)
      .patch("/api/articles/555")
      .send({ inc_votes: 20 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: comment deleted of specific comment id", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("404: sends an error if given a non-existing comment_id", () => {
    return request(app)
      .delete("/api/comments/555")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });

  test("400: sends an error if given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/NotID")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: sends an array of all the users in the database", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
