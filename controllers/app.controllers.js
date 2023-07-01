const {
	selectAllTopics,
	selectArticleById,
	selectAllArticles,
	selectCommentById,
	insertNewComment,
	updateArticleVotes,
	deleteSelectedComment,
	selectAllUsers,
	selectFilter,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getApi = (req, res) => {
	res.status(200).send(endpoints);
};

exports.getAllTopics = async (req, res, next) => {
	try {
		const topics = await selectAllTopics();
		res.status(200).send({ topics });
	} catch (err) {
		return next(err);
	}
};

exports.getAllArticles = async (req, res, next) => {
	try {
		const articles = await selectAllArticles();
		res.status(200).send({ articles });
	} catch (err) {
		return next(err);
	}
};

exports.getArticleById = async (req, res, next) => {
	const { article_id } = req.params;
	try {
		const article = await selectArticleById(article_id);
		res.status(200).send({ article });
	} catch (err) {
		return next(err);
	}
};

exports.getCommentsById = async (req, res, next) => {
	const { article_id } = req.params;
	try {
		const data = await selectArticleById(article_id);
		const comments = await selectCommentById(article_id);
		res.status(200).send({ comments });
	} catch (err) {
		return next(err);
	}
};

exports.postCommentById = async (req, res, next) => {
	const { article_id } = req.params;
	const { body, username } = req.body;

	try {
		const comment = await insertNewComment(article_id, body, username);
		res.status(201).send({ comment });
	} catch (err) {
		return next(err);
	}
};

exports.patchArticleVotes = async (req, res, next) => {
	const { inc_votes } = req.body;
	const { article_id } = req.params;
	try {
		const article = await updateArticleVotes(inc_votes, article_id);
		res.status(200).send({ article });
	} catch (err) {
		return next(err);
	}
};

exports.removeComment = async (req, res, next) => {
	const { comment_id } = req.params;
	try {
		const data = await deleteSelectedComment(comment_id);
		res.status(204).send();
	} catch (err) {
		return next(err);
	}
};

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await selectAllUsers();
		res.status(200).send({ users });
	} catch (err) {
		return next(err);
	}
};
