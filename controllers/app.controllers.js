const {
	selectAllTopics,
	selectArticleById,
	selectAllArticles,
	selectCommentById,
	insertNewComment,
	updateArticleVotes,
	deleteSelectedComment,
	selectAllUsers,
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

exports.patchArticleVotes = (req, res, next) => {
	const { inc_votes } = req.body;
	const { article_id } = req.params;

	updateArticleVotes(inc_votes, article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.removeComment = (req, res, next) => {
	const { comment_id } = req.params;
	deleteSelectedComment(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

exports.getAllUsers = (req, res, next) => {
	selectAllUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};
