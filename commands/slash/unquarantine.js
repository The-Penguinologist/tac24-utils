const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'H',
    data: new SlashCommandBuilder()
        .setName('unquarantine')
        .setDescription('Remove a user from quarantine.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to remove from quarantine').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for removing quarantine').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!target) return interaction.reply({ content: 'User is not in the server.', ephemeral: true });

        const quarantineRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'quarantine');
        
        if (!quarantineRole || !target.roles.cache.has(quarantineRole.id)) {
            return interaction.reply({ content: 'This user is not currently quarantined.', ephemeral: true });
        }

        await target.roles.remove(quarantineRole, reason);
        
        const embed = buildStandardEmbed('Quarantine Removed', `**User:** <@${target.id}>\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
