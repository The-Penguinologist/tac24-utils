const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'H',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to kick').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!target) return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        if (!target.kickable) return interaction.reply({ content: 'I do not have permission to kick this user.', ephemeral: true });

        await target.kick(reason);
        
        const embed = buildStandardEmbed('User Kicked', `**User:** <@${target.id}>\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
