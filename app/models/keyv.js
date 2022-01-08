const Keyv = require('keyv');
const env = require('../configs/env');
env.environment;

// Initialize Keyv and log errors
const keyv = new Keyv(process.env.REDIS_URL);
keyv.on('error', (err) => {
	console.log('Redis encountered an error: ', err);
});

module.exports = {
	// Initialize empty array if data does not exist for this key
	async initialize(key) {
		const data = await keyv.get(key);
		if (!data) {
			keyv.set(key, []);
			console.log(`Initialized empty array to key ${key}`);
		}
	},
	// Get data with key
	async get(key) {
		const data = await keyv.get(key);
		return data;
	},
	// Set data with key
	async set(key, value) {
		await keyv.set(key, value);
		return { key, value };
	},
};
