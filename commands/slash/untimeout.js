const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'H',
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove a timeout from a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to remove the timeout from').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for removing timeout').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!target) return interaction.reply({ content: 'User is not in the server.', ephemeral: true });

        await target.timeout(null, reason);
        
        const embed = buildStandardEmbed('Timeout Removed', `**User:** <@${target.id}>\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
