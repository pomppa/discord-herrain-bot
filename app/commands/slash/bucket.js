const { SlashCommandBuilder } = require('@discordjs/builders');
const env = require ('../../configs/env');
env.environment();

const url = process.env.S3_BASE_URL + '/' + process.env.S3_FILES_PATH + '/' + process.env.S3_INDEX_FILE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bucket'),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'url') interaction.reply(url);
    },
};