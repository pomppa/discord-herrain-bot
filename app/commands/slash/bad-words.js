const { SlashCommandBuilder } = require('@discordjs/builders');
const dataListManager = require('../../models/datalist-manager');
const env = require('../../configs/env');
env.environment();

const dataKey = process.env.REACTION_WORDS_KEY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName(dataKey),
    async execute(interaction) {
        await dataListManager.execute(interaction, dataKey).then(message => {
            interaction.reply(message);
        });
    },
};