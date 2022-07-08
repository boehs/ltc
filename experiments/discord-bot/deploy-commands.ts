import * as fs from 'node:fs';
import * as path from 'node:path';
import { REST } from  '@discordjs/rest';
import { Routes } from 'discord-api-types/v9'
import 'dotenv/config'
import { fileURLToPath } from 'node:url';

const commands = [];
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(process.env.clientid, process.env.guildid), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);