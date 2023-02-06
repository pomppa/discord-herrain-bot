const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll'),
    async execute(interaction) {
        const min = 1;
        let max = interaction.options.getInteger('max');

        let roll = 0;
        if (!max) max = 100;

        roll = Math.floor(Math.random() * max) + min;
        if (roll === parseInt(roll, 10)) {
            return interaction.reply('<@' + interaction.user.id + '>' + ' rolls 1-' + max.toString() + ': ' + roll.toString());
        }
    },
};