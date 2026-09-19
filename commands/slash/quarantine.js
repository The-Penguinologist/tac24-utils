const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'H',
    data: new SlashCommandBuilder()
        .setName('quarantine')
        .setDescription('Quarantine a user by assigning the Quarantine role.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to quarantine').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for quarantine').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!target) return interaction.reply({ content: 'User is not in the server.', ephemeral: true });

        // Assumes you have a role exactly named "Quarantine" in the server
        const quarantineRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'quarantine');
        
        if (!quarantineRole) {
            return interaction.reply({ content: 'Could not find a role named "Quarantine" on this server.', ephemeral: true });
        }

        await target.roles.add(quarantineRole, reason);
        
        const embed = buildStandardEmbed('User Quarantined', `**User:** <@${target.id}>\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
