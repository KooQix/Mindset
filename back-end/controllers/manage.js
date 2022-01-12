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

		// Stream fails on iPhone and I need to be able to play from iPhone to I came up with this...
		model.cp(id);

		const stat = fs.statSync(`${__dirname}/${name}`);
		const total = stat.size;
		const range = req.headers.range;
		const parts = range.replace(/bytes=/, "").split("-");
		const partialStart = parts[0];
		const partialEnd = parts[1];

		const start = parseInt(partialStart, 10);
		const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
		const chunksize = end - start + 1;

		const musicStream = fs.createReadStream(`${__dirname}/${name}`, {
			start: start,
			end: end,
		});
		res.writeHead(206, {
			"Content-Range": "bytes " + start + "-" + end + "/" + total,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "audio/mpeg; charset=UTF-8",
		});

		musicStream.pipe(res);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
