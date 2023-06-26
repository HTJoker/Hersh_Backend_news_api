const { selectAllTopics } = require("../models/app.models");

exports.getApi = (req, res) => {
	res.status(200).send({ msg: "We did it" });
};

exports.getAllTopics = (req, res) => {
	selectAllTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};
