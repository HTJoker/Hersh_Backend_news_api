const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	return db.end();
});

describe("GET /api", () => {
	it("should return 200 ok message", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.msg).toBe("We did it");
			});
	});
});

describe("GET /api/topics", () => {
	it("should return an array of all the topics when a get request is made", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body: { topics } }) => {
				topics.forEach((topic) => {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
