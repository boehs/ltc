import * as fs from 'node:fs';
import * as path from 'node:path';
import { Client, Collection, Intents } from 'discord.js';
import 'dotenv/config'
import { fileURLToPath } from 'node:url';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// @ts-expect-error
client.commands = new Collection();

const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath)
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
    // @ts-expect-error
	client.commands.set(command.default.data.name, command.default);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    // @ts-expect-error
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.token);
