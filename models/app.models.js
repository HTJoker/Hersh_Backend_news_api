const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllArticles = () => {
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
			COUNT(comments.article_id) AS comment_count 
			FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
			GROUP BY articles.article_id 
			ORDER BY created_at DESC;`
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

exports.selectCommentById = (article_id) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
			[article_id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.insertNewComment = (article_id, body, username) => {
	if (!body || !username) {
		return Promise.reject({ status: 400, msg: "Bad Request!" });
	}
	const queryStr = `INSERT INTO comments(body, author, article_id) 
	VALUES($1, $2, $3) RETURNING *;`;
	const values = [body, username, article_id];

	return db.query(queryStr, values).then(({ rows }) => {
		return rows[0];
	});
};

exports.updateArticleVotes = (votes, article_id) => {
	if (!votes) return Promise.reject({ status: 400, msg: "Bad Request!" });

	return db
		.query(
			`UPDATE articles 
		SET votes = votes + $1 
		WHERE article_id = $2 
		RETURNING*;`,
			[votes, article_id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "Not found" });
			}
			return rows[0];
		});
};
