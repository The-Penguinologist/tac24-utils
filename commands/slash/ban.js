const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'S',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        const member = interaction.guild.members.cache.get(target.id);
        if (member && !member.bannable) {
            return interaction.reply({ content: 'I do not have permission to ban this user.', ephemeral: true });
        }

        await interaction.guild.members.ban(target, { reason });
        
        const embed = buildStandardEmbed('User Banned', `**User:** <@${target.id}>\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
