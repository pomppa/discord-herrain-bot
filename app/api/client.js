const env = require('../configs/env');
env.environment();

const fetch = require('node-fetch');
const auth = 'Bot ' + process.env.TOKEN;
const url = process.env.DISCORD_API_BASE_URL + '/guilds/' + process.env.GUILD_ID + '/members/';

module.exports = {

	/**
     * Validate that current user id is present on the guild
     * @param {*} userId
     * @returns {status, data} status code and data
     */
	getUserIsAllowed(userId) {
		return fetch(url + userId, {
			headers: { 'Authorization': auth },
		})
			.then(res => Promise.all([res.status, res.json()]))
			.then(([status, jsonData]) => {

				const data = {
					isAllowed: false,
				};

				if (status === 200 && jsonData.user.id) {
					data.isAllowed = true;
				}

				return { status, data };

			});

	},
};
