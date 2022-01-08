// Constants
const fs = require('fs');
const path = require('path');
const express = require('./express');
const env = require('./configs/env');
const commons = require ('./functions/commons');
const commands = require ('./commands/commands');
const deployCommands = require ('./deploy-commands');
const cron = require('./cron/cron.js');
const keyv = require('./models/keyv');

// Client settings
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Create commands collection
client.commands = new Collection();
const dirPath = path.resolve(__dirname, './commands/slash');
const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));

// Loop command files
for (const file of commandFiles) {
	const command = require(`./commands/slash/${file}`);
	client.commands.set(command.data.name, command);
}

// Initialize express server and get env for local development, register commands
express.initialize();
env.environment();
deployCommands.execute();
keyv.initialize(process.env.DELETE_WORDS_KEY);
keyv.initialize(process.env.REACTION_WORDS_KEY);

// Login as bot, then initialize cron
client.login(process.env.TOKEN).then(cron.schedule(client));

// Bot ready
client.on('ready', () => {
	console.log(`Logged in as ${client.user.id}.`);
});

// Handle specific commands
client.on('messageCreate', msg => {
	if (msg.content.startsWith('!') && !msg.author.bot) {
		commands.execute(client, msg);
	}
});

// Handle common functions
client.on('messageCreate', msg => {
	if (!msg.content.startsWith('!') && !msg.author.bot) {
		commons.execute(client, msg);
	}
});

// Handle commands on interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});
