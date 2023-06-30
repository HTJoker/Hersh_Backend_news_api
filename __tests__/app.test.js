const request = require("supertest");
const { sort } = require("jest-sorted");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const tdata = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(tdata));
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
	it("status 200: return an array of objects that have a comment_count as an added column", () => {
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
						comment_count: expect.any(String),
					});
				});
			});
	});
	it("should check to see that the default sort by is descending order by the created at column", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("created_at", { descending: true });
			});
	});
});

describe("GET /api/articles/:article_id/comment", () => {
	it("status 200: return an array of comments based off the article id", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).not.toHaveLength(0);
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: expect.any(Number),
					});
				});
			});
	});
	it("should check to see that the comments return in order of most recent", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("status 200: return an empty array if article exists, but there is no comments", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toHaveLength(0);
			});
	});
	it("status 400: return Bad request when given an invalid id", () => {
		return request(app)
			.get("/api/articles/banana/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request!");
			});
	});
	it("status 404: returns not found when id is not in the array", () => {
		return request(app)
			.get("/api/articles/99999/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("POST /api/articles/:article_id/comment", () => {
	it("status 201: responds with a created a new comment", () => {
		const requestBody = {
			username: "butter_bridge",
			body: "I did not expect that",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(requestBody)
			.expect(201)
			.then(({ body: { comment } }) => {
				expect(comment.comment_id).toBe(19);
				expect(comment.body).toBe("I did not expect that");
				expect(comment.votes).toBe(0);
				expect(comment.author).toBe("butter_bridge");
				expect(comment.article_id).toBe(1);
				expect(comment.created_at).toEqual(expect.any(String));
			});
	});
	it("status 400: return Bad request when given invalid id", () => {
		const requestBody = {
			username: "butter_bridge",
			body: "I did not expect that",
		};
		return request(app)
			.post("/api/articles/yes/comments")
			.send(requestBody)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
	it("status 400: return Bad request when missing body", () => {
		return request(app)
			.post("/api/articles/1/comments")
			.send({ username: "butter_bridge" })
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
	it("status 404: return Bad request when missing username", () => {
		return request(app)
			.post("/api/articles/1/comments")
			.send({ body: "I did not expect that" })
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
	it("status 404: returns not found when id is valid, but non-existent", () => {
		return request(app)
			.get("/api/articles/99999/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
	it("status 404: return Not found user is not in the table", () => {
		const requestBody = {
			username: "JoeSwanson",
			body: "I did not expect that",
		};
		return request(app)
			.post("/api/articles/2/comments")
			.send(requestBody)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not found");
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	it("status 200: should update the article votes property by the amount inputted", () => {
		const votes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/1")
			.send(votes)
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: expect.any(String),
					votes: 101,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
	it("status 200: should update the article votes property by the amount inputted when votes are negative", () => {
		const votes = { inc_votes: -85 };
		return request(app)
			.patch("/api/articles/1")
			.send(votes)
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: expect.any(String),
					votes: 15,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
	it("status 400: return bad request when passed an invalid votes input", () => {
		const votes = { inc_votes: "more" };
		return request(app)
			.patch("/api/articles/1")
			.send(votes)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
	it("status 404: return Not found when passed a id that is valid, but does not exist", () => {
		const votes = { inc_votes: 23 };
		return request(app)
			.patch("/api/articles/999999")
			.send(votes)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not found");
			});
	});
	it("status 400: return Bad request when passed a id that is invalid", () => {
		const votes = { inc_votes: 23 };
		return request(app)
			.patch("/api/articles/justWrong")
			.send(votes)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	it("status 204: should delete comment based off comment_id ", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});
	it("status 404: returning not found given a valid id, but it does not exist", () => {
		return request(app)
			.delete("/api/comments/20000")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not found");
			});
	});
	it("status 404: returning not found given a valid id, but it does not exist", () => {
		return request(app)
			.delete("/api/comments/wrongId")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Bad Request!");
			});
	});
});

describe("GET /api/users", () => {
	it("status 200: should return an array of objects with the properties username, name, avatar_url", () => {
		return request(app)
			.get("/api/users")
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
	it("status 404: should return not found when passed an invalid path", () => {
		return request(app)
			.get("/api/invalidPath")
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Not found");
			});
	});
});
