const express = require('express');
const app = express();

// Initialize express server
const initialize = () => {
	app.use(express.static('public'));
	app.get('/', (req, res) => res.send('moi'));
	app.listen(process.env.PORT || 8083, () => console.log('Express server listening.'));
};

exports.initialize = initialize;