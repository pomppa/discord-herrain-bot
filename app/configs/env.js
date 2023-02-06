const env = require('node-env-file');

const environment = () => {
    if (process.env.NODE_ENV !== 'production') {
        env(__dirname + '/files/.env');
    }
};

exports.environment = environment;
