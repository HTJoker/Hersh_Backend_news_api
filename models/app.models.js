const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows
	});
};

exports.selectAllEndpoints = () => {
	console.log("hello");
}