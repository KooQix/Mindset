const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.API_PORT ?? 3000;
const URL = process.env.API_URL ?? `http://localhost:${PORT}`;

const manage = require("./controllers/manage");
const { authenticateToken } = require("./middlewares/token");
const authController = require("./controllers/auth");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/login", authController);
app.use("/api/manage", authenticateToken, manage);

// Launch server
app.listen(PORT, () => {
	console.log(`Listening at ${URL}`);
});
