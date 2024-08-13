module.exports = {
	auth(req, res, next) {
		if (req.session.user) next();
		else res.status(401).end();
	},
	idParam(req, res, next){
		if (req.params.id){
			req.params.id = parseInt(req.params.id);
			if (isNaN(req.params.id)) res.status(400).json({message: "ID harus berupa angka"});
			else next();
		} else next();
	}
};
