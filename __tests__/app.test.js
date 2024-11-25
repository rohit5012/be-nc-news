const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");

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

// describe("GET/api/topics", () => {
//   test("200: sends an array of all topics", () => {
//     return request(app)
//       .get("/api/topics")
//       .expect(200)
//       .then(({ body: { topics } }) => {
//         expect(topics.length).toBe(3);
//         topics.forEach((topic) => {
//           expect(topic).toMatchObject({
//             description: expect.any(String),
//             slug: expect.any(String),
//           });
//         });
//       });
//   });
// });
