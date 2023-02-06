const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perjantai'),
    async execute(interaction) {
        const day = new Date;

        if (day.getDay() == 5) {
            return interaction.reply('https://www.youtube.com/watch?v=76yIAQcmj9Y' + '\n' + '<@' + interaction.user.id + '>' + ' se ompi,,,periantai,,nytte;)))');
        }
        else {
            return interaction.reply('<@' + interaction.user.id + '>' + ' ei oo perjantai');
        }
    },
};