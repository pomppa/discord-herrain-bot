const timers = {};

// ! commands
function execute(client, msg) {
	const channel = client.channels.cache.get(msg.channelId);


	/**
     * !timer
     *
     * Oldschool timer
     */
	if (msg.content.startsWith('!timer')) {

		// Check if user has timers
		if (timers[msg.author.id]) {
			return channel.send('You already have an active timer.');
		}

		// Validate minutes
		const args = msg.content.split(' ');
		if (parseInt(args[1])) {
			const minutes = args[1];
			const milliseconds = minutes * 60000;
			const timer = setTimeout(reply, milliseconds, msg.author.id);
			timers[msg.author.id] = timer;
			channel.send(`Timer set to ${minutes} minutes.`);

		}
		else {
			channel.send('Add minutes.');
		}
	}


	/**
     *
     */
	if (msg.content.startsWith('!cancel')) {
		if (!timers[msg.author.id]) {
			return channel.send('You dont have any active timers.');
		}
		else {
			clearTimeout(timers[msg.author.id]);
			delete timers[msg.author.id];
			return channel.send('Canceled timer.');
		}
	}

	/**
     * Send a reply and delete timer
     */
	async function reply() {
		delete timers[msg.author.id];
		return channel.send(`<@${msg.author.id}> wake up!`);
	}

}

module.exports = {
	execute,
};