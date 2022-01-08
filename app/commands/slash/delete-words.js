const { SlashCommandBuilder } = require('@discordjs/builders');
const dataListManager = require('../../models/datalist-manager');
const env = require ('../../configs/env');
env.environment();

const allowedRolesForAdd = process.env.DELETE_WORDS_ALLOWED_ROLES_TO_ADD;
const dataKey = process.env.DELETE_WORDS_KEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName(dataKey),
	async execute(interaction) {

		// Workaround to check role as options do not support permissions
		if (interaction.options.getSubcommand() !== 'list') {
			if (!allowedRolesForAdd.includes(interaction.member._roles[0])) {
				return interaction.reply('Role does not have access to configure words.');
			}
		}

		await dataListManager.execute(interaction, dataKey).then(message => {
			return interaction.reply(message);
		});
	},
};