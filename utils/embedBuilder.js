const { EmbedBuilder } = require('discord.js');

module.exports = {
    buildStandardEmbed: (title, description, color = '#2b2d31') => {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setThumbnail('attachment://main_logo.png') // Main logo only
            .setImage('attachment://banner.png');       // Standard banner
    }
};
