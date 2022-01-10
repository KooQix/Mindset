const puppeteer = require("puppeteer");
const pool = require("./db/db");
const { exec } = require("child_process");

/**
 * Programs takes at least one parameter: the channel name (from the database)
 * If Second parameter, the program will load the entire page before scrapping (when adding a new Channel do the database)
 * 
 * [
  '/opt/homebrew/Cellar/node/17.2.0/bin/node',
  '/Users/kooqix/Documents/Informatique/Codage/Web/Projects/Mindset/back-end/scrapping/main.js',
  'Motivation2Study'
]
 */

async function deleteVideo(id) {
	exec(`rm -f ../downloads/${id}*`, (err, stdout, stderr) => {
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

async function downloadVideos(videos, channelName) {
	for (const video of videos) {
		setTimeout(() => {
			const video_id = video.link.split("?");
			exec(
				`youtube-dl -ix --no-warnings --no-playlist --audio-format mp3 -o '${__dirname}/downloads/${
					video_id[video_id.length - 1]
				}.mp3' ${video.link}`,
				async (err, stdout, stderr) => {
					if (err) {
						console.log(err);
						deleteVideo(video.id);
						return;
					}

					if (stderr) {
						console.log(stderr);
						return;
					}
					console.log(stdout);

					// Video has been downloaded successfully, can add it to the database
					// Add videos to the database
					const res = await pool.query(
						`SELECT * FROM Videos WHERE title = "${video.title}"`,
					);
					if (res[0].length !== 0) return;

					// Doesn't exist in database => add it
					await pool.query(
						`INSERT INTO Videos (link, title, duration, channel) VALUES ("${video.link}", "${video.title}", ${video.duration}, '${channelName}')`,
					);
					await pool.query("COMMIT");

					setTimeout(async () => {
						const id = await pool.query(
							`SELECT id FROM Videos WHERE link = '${video.link}'`,
						);
						exec(
							`mv ${__dirname}/downloads/${
								video_id[video_id.length - 1]
							}.mp3 ${__dirname}/downloads/${id[0][0].id}.mp3`,
						);
					}, 300);
				},
			);
		}, 1000);
	}
}

async function scrap(channelName, isNew) {
	const browser = await puppeteer.launch({ headless: true }); //false => open a browser window, true: do it under the hood
	const page = await browser.newPage();
	await page.goto(`https://www.youtube.com/c/${channelName}/videos`);

	// Accept cookies
	let consent =
		".qqtRac > form:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)";
	await page.click(consent);

	//////////////////// Scrapping starts here \\\\\\\\\\\\\\\\\\\\

	setTimeout(async () => {
		//////////////////// Load the whole page before scrapping \\\\\\\\\\\\\\\\\\\\

		if (isNew) {
			await scrollToBottom(page);
			await page.waitForTimeout(10000);

			async function scrollToBottom(pageToScroll) {
				const distance = 100; // should be less than or equal to window.innerHeight
				const delay = 200; //adjust delay to load the whole pageToScroll
				while (
					await pageToScroll.evaluate(
						() =>
							document.scrollingElement.scrollTop +
								window.innerHeight <
							document.scrollingElement.scrollHeight,
					)
				) {
					await pageToScroll.evaluate((y) => {
						document.scrollingElement.scrollBy(0, y);
					}, distance);
					await pageToScroll.waitForTimeout(delay);
				}
			}
		}
		const videos = await page.evaluate(() => {
			//////////////////// This will be executed inside the browser, as a user opening the page \\\\\\\\\\\\\\\\\\\\

			let videos = [];
			let elements = document.querySelectorAll("ytd-grid-video-renderer");
			for (let element of elements) {
				const title = element.querySelector("h3 a").innerText;
				const fromLink = element.querySelector("a");
				const link = fromLink.href;
				const duration_str = fromLink.querySelector("span").innerText;

				// Convert duration_str to seconds
				const duration_split = duration_str.split(":");
				let duration = 0;
				for (let i = 0; i < duration_split.length; i++) {
					duration +=
						duration_split[i] *
						Math.pow(60, duration_split.length - 1 - i);
				}
				videos.push({
					link: link,
					title: title,
					duration: duration,
				});
			}
			return videos;
		});
		await browser.close();

		// Download videos and add them to the database when they are available
		downloadVideos(videos, channelName);
	}, 2000);
}

module.exports = scrap;
