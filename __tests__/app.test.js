const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
	it("should return an array", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body: { topics } }) => {
				expect(Array.isArray(topics)).toBe(true);
			});
	});
	it("should return an array of all the topics when a get request is made", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body: { topics } }) => {
				expect(topics.length).not.toBe(0);
				topics.forEach((topic) => {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
