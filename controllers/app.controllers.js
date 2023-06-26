const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (req, res, next) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

exports.getAllEndpoints = (req, res, next) => {
	selectAllEndpoints()
		.then((endpoints) => {
			res.status(200).send({ endpoints });
		})
		.catch(next);
};
