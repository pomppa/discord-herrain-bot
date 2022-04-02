const express = require('express');
const app = express();
const client = require('./api/client.js');

// Initialize express server
const initialize = () => {
	app.use(express.static('public'));
	app.get('/', (req, res) => res.send('moi'));

	app.get('/api/users/:userId', (req, res) => {
		client.getUserIsAllowed(req.params.userId)
			.then(resp => {
				res.status(resp.status);
				res.send(resp.data);
				console.log(`Validated user with ID ${req.params.userId}. Validation evaluated as ${resp.data.isAllowed}.`);
			})
			.catch(err => console.log('Error validating user on Discord API: ' + err.message));
	});

	app.listen(process.env.PORT || 8083, () => console.log('Express server listening.'));
};

exports.initialize = initialize;