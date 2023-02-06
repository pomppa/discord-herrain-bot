const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer'),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');

        // Token is valid only for 15 minutes
        if (minutes > 15) {
            return interaction.reply({
                content: 'Maximum amount of timer is 15 minutes. Use !timer for timers over 15 minutes.',
                ephemeral: 'true',
            });
        }

        // Defer reply as without it reply would be valid only for 3 seconds
        await interaction.deferReply();

        // Convert to milliseconds
        let milliseconds = (minutes * 60000);

        // If 15 minutes was used, deduct some five seconds to avoid deferred reply token expiring
        if (milliseconds === 900000) {
            milliseconds = milliseconds - 5000;
        }
        setTimeout(reply, milliseconds);

        async function reply() {
            return await interaction.editReply(`<@${interaction.user.id}> wake up!`);
        }
    },
};