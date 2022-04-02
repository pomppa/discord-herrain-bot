const env = require ('./configs/env');
env.environment();

const express = require('express');
const app = express();
const client = require('./api/client.js');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// Initialize express server
const initialize = () => {
	app.use(express.static('public'));

	app.get('/', (req, res) => res.send('moi'));

	app.get('/api/users/:userId', checkJwt, (req, res) => {

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