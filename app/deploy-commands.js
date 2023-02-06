const env = require('./configs/env');
env.environment();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info'),
    new SlashCommandBuilder().setName('perjantai').setDescription('Send perjantai if it is perjantai'),
    new SlashCommandBuilder().setName('roll')
        .setDescription('Supply max as argument, by default rolls from 1-100')
        .addIntegerOption(option => option.setName('max').setDescription('Enter max value')),
    new SlashCommandBuilder().setName('timer')
        .setDescription('Set a timer in minutes')
        .addIntegerOption(option => option.setName('minutes').setDescription('Minutes')),
    new SlashCommandBuilder().setName(process.env.DELETE_WORDS_KEY)
        .setDescription('Manage words')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a word to list')
                .addStringOption(option => option.setName('word').setDescription('Word to add')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a word from list')
                .addStringOption(option => option.setName('word').setDescription('Word to remove')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Display list')),
    new SlashCommandBuilder().setName(process.env.REACTION_WORDS_KEY)
        .setDescription('Manage words')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a word to list')
                .addStringOption(option => option.setName('word').setDescription('Word to add')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a word from list')
                .addStringOption(option => option.setName('word').setDescription('Word to remove')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Display list')),
    new SlashCommandBuilder().setName('bucket')
        .setDescription('S3 bucket actions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('url')
                .setDescription('Get bucket URL')),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

module.exports = {
    async execute() {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);
    },
};
