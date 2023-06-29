const {
	selectAllTopics,
	selectArticleById,
	selectAllArticles,
	selectCommentById,
	insertNewComment,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getApi = (req, res) => {
	res.status(200).send(endpoints);
};

exports.getAllTopics = (req, res, next) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then(() => {
			selectCommentById(article_id).then((comments) => {
				res.status(200).send({ comments });
			});
		})
		.catch(next);
};

exports.postCommentById = (req, res, next) => {
	const { article_id } = req.params;
	const { body, username } = req.body;
	insertNewComment(article_id, body, username)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
