const s3upload = require('./s3-upload');
const keyv = require('../models/keyv');
const env = require('../configs/env');
env.environment();

// Handle some generic functionalities on messages
function execute(client, msg) {
	const channel = client.channels.cache.get(msg.channelId);

	// Send links & attacments to S3
	if (msg.channel.id == process.env.S3_UPLOAD_CHANNEL_ID) {
		s3upload.execute(msg);
	}

	/**
   * Deletes message on words words
   *
   * Initialize by fetching all words from redis with key
   * Loop through words to find if word exists in list
   * Delete the message, post a reply
   */
	if (msg.content) {
		keyv.get(process.env.DELETE_WORDS_KEY).then(data => {
			data.forEach(word => {
				if (msg.content.toLowerCase().includes(word)) {
					msg.delete();
					return channel.send(`<@${msg.author.id}> stop using ${process.env.DELETE_WORDS_KEY} words.`);
				}
			});
		});
	}

	/**
   * React to message with words
   *
   * Initialize by fetching all words with key
   * Loop through all words of the message
   * If found, add a reaction to the message
   */
	if (msg.content) {
		keyv.get(process.env.REACTION_WORDS_KEY).then(data => {
			data.forEach(word => {
				if (msg.content.toLowerCase().includes(word)) {
					msg.react(process.env.REACTION_EMOJI);
				}
			});
		});
	}
}

module.exports = {
	execute,
};