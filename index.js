require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Initialize the Discord Client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Essential for !admin and other prefix commands
        GatewayIntentBits.GuildMembers,   // Essential for checking user roles/permissions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

// Setup Collections to store commands in memory
client.commands = new Collection();
client.prefixCommands = new Collection();
client.commandData = []; // Stores slash command data to be registered in events/ready.js

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Successfully connected to MongoDB.');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Load Events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        
        // Bind the event listener to the client
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

// Load Prefix Commands
const prefixPath = path.join(__dirname, 'commands', 'prefix');
if (fs.existsSync(prefixPath)) {
    const prefixFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith('.js'));
    for (const file of prefixFiles) {
        const filePath = path.join(prefixPath, file);
        const command = require(filePath);
        
        if ('name' in command && 'execute' in command) {
            client.prefixCommands.set(command.name, command);
        } else {
            console.warn(`[WARNING] Prefix command at ${filePath} is missing 'name' or 'execute' property.`);
        }
    }
}

// Load Slash Commands
const slashPath = path.join(__dirname, 'commands', 'slash');
if (fs.existsSync(slashPath)) {
    const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));
    for (const file of slashFiles) {
        const filePath = path.join(slashPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            client.commandData.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] Slash command at ${filePath} is missing 'data' or 'execute' property.`);
        }
    }
}

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
