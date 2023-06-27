const { selectAllTopics } = require("../models/app.models");
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
