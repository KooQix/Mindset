const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async (req, res) => {
	try {
		const pass = req.body.pass;
		if (!!!pass) throw new Error("Password required");

		// Check password
		if (pass === process.env.pass) {
			const token = jwt.sign(
				{ id: process.env.JWT_T },
				process.env.JWT_SECRET,
				{
					expiresIn: "1 month",
				},
			);

			res.send({ token: token });
			return;
		}

		// Wrong password
		res.status(403).send({ error: "Wrong password" });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.get("/token/:token", async (req, res) => {
	try {
		const token = req.params.token;
		if (!!!token) throw new Error("Token required");

		jwt.verify(token, process.env.JWT_SECRET, (err, resp) => {
			// Forbidden
			if (err) return res.send(false);

			res.send(true);
		});
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
