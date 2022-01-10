const router = require("express").Router();
const fs = require("fs");

const model = require("../db/manage");

const dotenv = require("dotenv");
dotenv.config();

//////////////////// Managing channels \\\\\\\\\\\\\\\\\\\\

router.get("/channels", async (req, res) => {
	try {
		res.send(await model.getChannels());
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.post("/channel", async (req, res) => {
	try {
		const channel = req.body.channelName;
		res.send(await model.addChannel(channel));
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.delete("/channel", async (req, res) => {
	try {
		const channel = req.body.channelName;
		res.send(await model.rmChannel(channel));
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

//////////////////// Managing videos \\\\\\\\\\\\\\\\\\\\

router.get("/videos/:max_duration", async (req, res) => {
	try {
		const max_duration = req.params.max_duration;
		res.send(await model.getVideos(max_duration));
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

//////////////////// Stream \\\\\\\\\\\\\\\\\\\\

router.get("/stream/:id", async (req, res) => {
	try {
		const id = req.params.id;
		if (!!!id) return;

		// File has been downloaded, start stream
		const name = `../downloads/${id}.mp3`;

		res.set("content-type", "audio/mp3");
		res.set("accept-ranges", "bytes");

		let musicStream;
		musicStream = fs.createReadStream(`${__dirname}/${name}`);

		musicStream.pipe(res);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
