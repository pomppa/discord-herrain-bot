const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};