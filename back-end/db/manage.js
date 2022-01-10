const pool = require("./db");
const { exec } = require("child_process");
const scrap = require("../scrap");

function durationOK(duration, durationSelected) {
	return (
		0.9 * durationSelected <= duration && duration <= 1.1 * durationSelected
	);
}

// Regularly check added channels for new videos (every 48h)
setInterval(async () => {
	const channels = await this.getChannels();
	for (let channel of channels) {
		await this.scrapVideos(channel.name, false);
	}
}, 48 * 60 * 60 * 1000);

async function getVideosID(channelName) {
	const res = await pool.query(
		`SELECT id FROM Videos WHERE channel = '${channelName}'`,
	);

	let id = [];
	for (const i of res[0]) {
		id.push(i.id);
	}
	return id;
}
async function deleteVideo(id) {
	exec(`rm -f ${__dirname}/../downloads/${id}*`, (err, stdout, stderr) => {
		if (err) {
			console.log(err);
			return;
		}

		if (stderr) {
			console.log(stderr);
		}
	});
	try {
		await pool.query(`DELETE FROM Videos WHERE id = ${id}`);
		await pool.query("COMMIT");
	} catch (error) {
		// Video hasn't been added to the database so not removed
	}
}

module.exports = {
	/**
	 * Scrap videos for new videos (every 48h). If isNew, load the whole page of videos before scrapping (then a channel is added). Otherwise, solely checks the newest videos
	 *
	 * @param {*} channelName
	 * @param {*} isNew
	 */
	async scrapVideos(channelName, isNew) {
		try {
			scrap(channelName, isNew);
		} catch (error) {
			console.log(error);
		}
	},

	//////////////////// Managing channels \\\\\\\\\\\\\\\\\\\\

	async addChannel(channelName) {
		// Check if already exist
		const res = await pool.query(
			`SELECT * FROM Channels WHERE name='${channelName}'`,
		);
		if (res[0].length > 0) return { error: "Already exist" };

		// Channel doesn't exist, add it
		await pool.query(
			`INSERT INTO Channels (name) VALUES ("${channelName}")`,
		);
		await pool.query("COMMIT");
		this.scrapVideos(channelName, true);
		return { message: "OK" };
	},

	async getChannels() {
		const res = await pool.query(`SELECT name FROM Channels`);

		let channels = [];
		for (let c of res[0]) {
			const nbVideos = await pool.query(
				`SELECT COUNT(id) as nb FROM Videos WHERE channel = '${c.name}'`,
			);
			channels.push({
				name: c.name,
				nbVideos: nbVideos[0][0].nb,
			});
		}
		return channels;
	},

	async rmChannel(channelName) {
		// Delete channel
		await pool.query(`DELETE FROM Channels WHERE name = '${channelName}'`);
		await pool.query("COMMIT");

		// Delete videos from that channel
		const videosID = await getVideosID(channelName);
		for (const videoID of videosID) deleteVideo(videoID);

		return { message: "OK" };
	},

	//////////////////// Managing videos \\\\\\\\\\\\\\\\\\\\

	async getRandomVideo(maxDuration) {
		const res = await pool.query(
			`SELECT * FROM Videos WHERE duration <= ${maxDuration}`,
		);

		// 0 -> res[0].length - 1
		const randomIndex = Math.floor(Math.random() * res[0].length);
		return res[0][randomIndex];
	},

	async getVideos(durationSelected) {
		let videos = [];
		let duration = 0;
		while (!durationOK(duration, durationSelected)) {
			const video = await this.getRandomVideo(
				durationSelected - duration,
			);
			if (!!!video) break;
			videos.push(video);
			duration += video.duration;
		}
		return videos;
	},
};
