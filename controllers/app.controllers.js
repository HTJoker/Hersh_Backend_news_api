exports.getApi = (req, res) => {
	res.status(200).send({ msg: "We did it" });
};

exports.getAllTopics = (req, res) => {
	selectAllTopics().then((response) => {
		res.status(200).send({ topics: response });
	});
};
