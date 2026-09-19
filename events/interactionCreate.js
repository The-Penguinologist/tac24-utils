const UserData = require('../models/UserData'); // Pseudo-model for DB

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        // Fetch configured roles from database set via !admin
        const guildConfig = await UserData.findOne({ guildId: interaction.guild.id });
        const userRoles = interaction.member.roles.cache;

        // Permission Tier Logic [C, P, M, H, S]
        const perms = guildConfig?.roles || {};
        const isSHR = userRoles.has(perms.SHR);
        const isHR = isSHR || userRoles.has(perms.HR);
        const isMid = isHR || userRoles.has(perms.MidPersonnel);
        const isPersonnel = isMid || userRoles.has(perms.Personnel);

        // Check command permission requirements
        if (command.permission === 'S' && !isSHR) {
            return interaction.reply({ content: 'You need SHR permissions to use this.', ephemeral: true });
        }
        if (command.permission === 'H' && !isHR) {
            return interaction.reply({ content: 'You need HR permissions to use this.', ephemeral: true });
        }
        if (command.permission === 'M' && !isMid) {
            return interaction.reply({ content: 'You need Mid-Personnel permissions to use this.', ephemeral: true });
        }
        if (command.permission === 'P' && !isPersonnel) {
            return interaction.reply({ content: 'You need Personnel permissions to use this.', ephemeral: true });
        }

        try {
            await command.execute(interaction, guildConfig);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        }
    },
};
