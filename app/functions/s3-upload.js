const request = require('request');
const s3 = require('./helpers/s3');
const env = require('../configs/env');

function execute(msg) {
	const url = getMediaUrlToUpload(msg);
	if (url) {
		env.environment();
		const fileName = new URL(url).pathname.split('/').pop();
		// TODO Switch to async request so that we can support arrays
		request({
			url: url,
			encoding: null,
		}, function(err, res) {
			if (err) {
				console.log('Requesting content from ' + msg.content + ' returned an error: ' + err);
				return;
			}
			console.log('Requested content from ' + url);
			if (res.headers['content-type'].match('audio/|media/|image/|video/')) {
				console.log('Content-type matched to media, proceeding to upload to S3');
				if (process.env.NODE_ENV == 'production') {
					s3.uploadFileFromURL(res, fileName);
				}
				else {
					console.log('Environment was not production, decided to not upload');
				}
			}
			else {
				console.log('Content-type did not match media, won\'t be uploaded to S3. Headers were: ' + res.headers['content-type']);
			}
		});
	}
}

// Get either direct link or links from attachments
// TODO push all to array
function getMediaUrlToUpload(msg) {

	// Check if we have URL on embeds
	if (msg.embeds.length > 0) {
		return msg.embeds[0].url;
	}

	// If link was not found from message, check if we have URL on attachments
	if (msg.attachments.first() ?. url) {
		return msg.attachments.first() ?. url;
	}

	return false;

}

module.exports = {
	execute,
};