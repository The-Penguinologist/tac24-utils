const { PermissionsBitField } = require('discord.js');
const { buildStandardEmbed } = require('../../utils/embedBuilder');

module.exports = {
    name: 'admin',
    description: 'Configure bot settings, permission roles, and quotas.',
    permission: 'S', // SHR Level Command
    
    async execute(message, args) {
        // Native fallback check to ensure only actual Discord admins can run configuration
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You need Server Administrator permissions to configure the bot.');
        }

        const subcommand = args[0]?.toLowerCase();

        // Handle: !admin setrole <tier> <@role>
        if (subcommand === 'setrole') {
            const tier = args[1];
            const roleInput = args[2];

            const validTiers = ['SHR', 'HR', 'MidPersonnel', 'Personnel'];
            
            if (!tier || !validTiers.includes(tier) || !roleInput) {
                return message.reply(`**Usage:** \`!admin setrole <Tier> <@Role>\`\n**Valid Tiers:** ${validTiers.join(', ')}`);
            }

            // Extract the pure ID whether they pinged the role (<@&123456...>) or just pasted the ID
            const roleId = roleInput.replace(/[<@&>]/g, '');
            const role = message.guild.roles.cache.get(roleId);

            if (!role) {
                return message.reply('Invalid role provided. Please mention a valid role or provide its ID.');
            }

            // Pseudo-DB save logic
            // const guildConfig = await UserData.findOne({ guildId: message.guild.id });
            // guildConfig.roles[tier] = role.id;
            // await guildConfig.save();

            const embed = buildStandardEmbed(
                'Admin Configuration Updated', 
                `Successfully bound the **${tier}** tier to <@&${role.id}>.`
            );

            return message.reply({ 
                embeds: [embed], 
                files: ['../../images/main_logo.png', '../../images/banner.png'] 
            });
        }

        // Base !admin response if no valid subcommand is provided
        message.reply('**Available commands:**\n`!admin setrole <Tier> <@Role>`');
    }
};
