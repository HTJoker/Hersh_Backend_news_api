const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllArticles = () => {
	return db
		.query(
			`SELECT articles.title, comments.votes FROM articles JOIN comments ON articles.article_id=comments.article_id LIMIT 5;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.selectArticleById = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "Not found" });
			}
			return rows[0];
		});
};
