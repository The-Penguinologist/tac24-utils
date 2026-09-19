const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'S',
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(opt => opt.setName('userid').setDescription('The ID of the user to unban').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the unban').setRequired(false)),
    
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        try {
            await interaction.guild.members.unban(userId, reason);
            const embed = buildStandardEmbed('User Unbanned', `**User ID:** ${userId}\n**Reason:** ${reason}`);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: 'Failed to unban. Make sure the ID is correct and the user is banned.', ephemeral: true });
        }
    }
};
