const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/development-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
	it("should return a 200 status and the list of endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpoints);
			});
	});
});

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

describe("GET /api/articles/:article_id", () => {
	it("status 200: return an individual article", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					article_id: expect.any(Number),
					body: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					article_img_url: expect.any(String),
				});
			});
	});
	it("status 400: return Bad request when given wrong id", () => {
		return request(app)
			.get("/api/articles/banana")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	it("status 404: returns not found when id is not in the array", () => {
		return request(app)
			.get("/api/articles/99999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("GET /api/articles", () => {
	it("should return an array", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(Array.isArray(articles)).toBe(true);
			});
	});
	it("status 200: return an array of objects that have a comment_count as an added column", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).not.toHaveLength(0);
				articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
				});
			});
	});
});
