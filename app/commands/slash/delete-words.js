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
		const allowedRolesArray = allowedRolesForAdd.split(',');

		if (interaction.options.getSubcommand() !== 'list') {
			if (!allowedRolesArray.some(role => interaction.member._roles.includes(role))) {
				return interaction.reply('Role does not have access to configure words.');
			}
		}

		await dataListManager.execute(interaction, dataKey).then(message => {
			return interaction.reply(message);
		});
	},
};