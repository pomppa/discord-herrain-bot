const Keyv = require('keyv');

// Initialize Keyv and log errors
const keyv = new Keyv('redis://user@localhost:6379');
keyv.on('error', (err) => {
	console.log('Redis encountered an error: ', err);
});

module.exports = {
	// Initialize empty array if data does not exist for this key
	async initialize(key) {
		const data = await keyv.get(key);
		if (!data) {
			keyv.set(key, []);
			console.log('Initialized empty array to key ${key}' + key);
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
