const express = require("express");
const {
	getAllTopics,
	getApi,
	getArticleById,
	getAllArticles,
	getCommentsById,
	postCommentById,
	patchArticleVotes,
	removeComment,
	getAllUsers,
	getFilteredArticles,
} = require("../controllers/app.controllers");
const {
	handleServerError,
	handlepsqlError,
	handleCustomError,
} = require("./errors");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postCommentById);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", removeComment);

app.all("*", (_, res) => {
	res.status(404).send({ msg: "Not found" });
});

app.use(handlepsqlError);

app.use(handleCustomError);

app.use(handleServerError);
module.exports = app;
