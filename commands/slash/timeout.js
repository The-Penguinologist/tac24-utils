const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    permission: 'H',
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('target').setDescription('The user to timeout').setRequired(true))
        .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the timeout').setRequired(false)),
    
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        if (!target) return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        if (!target.moderatable) return interaction.reply({ content: 'I do not have permission to timeout this user.', ephemeral: true });

        const msDuration = duration * 60 * 1000;
        await target.timeout(msDuration, reason);
        
        const embed = buildStandardEmbed('User Timed Out', `**User:** <@${target.id}>\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`);
        await interaction.reply({ embeds: [embed] });
    }
};
