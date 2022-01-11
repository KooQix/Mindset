const puppeteer = require("puppeteer");
const pool = require("./db/db");
const { exec } = require("child_process");

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


function split_array(array, index) {
	if (array.length < index) return [array, []];
	let arr = [[], []];
	for (let i = 0; i < index; i++) {
		arr[0].push(array[i]);
	}
	arr[1] = array.splice(index);
	return arr;
}

async function downloadVideos(videos, channelName) {
	let v;

	// Split download into parts, every 7 min
	if (videos.length > 30) {
		const array = split_array(videos, 30);
		v = array[0];

		setTimeout(() => {
			downloadVideos(array[1], channelName);
		}, 7 * 60 * 1000);
	}
	else v = videos;

	for (const video of v) {
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
		}, 5000);
	}
}

async function scrap(channelName, isNew) {
	// const browser = await puppeteer.launch({ headless: true, executablePath: '/usr/bin/chromium-browser', args: [ "--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-sandbox" ]}); //false => open a browser window, true: do it under the hood
	const browser = await puppeteer.launch({ headless: true}); //false => open a browser window, true: do it under the hood
	const page = await browser.newPage();
	await page.goto(`https://www.youtube.com/c/${channelName}/videos`, { waitUntil: 'networkidle0' });

	// Accept cookies
	let consent =
		".qqtRac > form:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1)";
	await page.click(consent);

	await page.waitForNavigation({ waitUntil: 'networkidle0' });

	//////////////////// Scrapping starts here \\\\\\\\\\\\\\\\\\\\

	setTimeout(async () => {
		//////////////////// Load the whole page before scrapping \\\\\\\\\\\\\\\\\\\\

		if (isNew) {
			await scrollToBottom(page);
			await page.waitForTimeout(50000);

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
