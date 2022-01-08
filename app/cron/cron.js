const cron = require('node-cron');
const env = require('../configs/env');
env.environment();

module.exports = {
	schedule(client) {

		/**
         * Schedule cron for fridays
         */
		cron.schedule('0 15 * * FRI', function() {
			console.log('Running a cron task on ' + new Date());
			const channel = client.channels.cache.get(process.env.PERJANTAI_CHANNEL_ID);
			channel.send('https://www.youtube.com/watch?v=76yIAQcmj9Y' + '\n' + 'se ompi periantai ja kohta töipäivä ohitte ;))))),,,räääh');
		});
		console.log('Scheduled cronjobs.');
	},
};
