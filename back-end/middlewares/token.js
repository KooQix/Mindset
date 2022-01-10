const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	authenticateToken(req, res, next) {
		let token = req.headers["token"];

		// Unauthorized
		if (!!!token) {
			token = req.query.token;
			if (!!!token) return res.send(false);
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
			// Forbidden
			if (err) return res.send(false);

			next();
		});
	},
};
