import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { sql } from 'kysely'
import { db, getLocation } from '../../../shared.js'
import TurndownService from 'turndown'
import { IPv4 } from "ip-num/IPNumber.js";

const turndownService = new TurndownService()

async function randomLetter() {
    return await db
        .selectFrom('ltc')
        .orderBy(sql`random()`, 'asc')
        .limit(1)
        .select(['lettermessage', 'id', 'letterpostdate', 'senderip'])
        .executeTakeFirst()
}

export default {
    data: new SlashCommandBuilder()
        .setName('love-letter')
        .setDescription('Replies with a love letter')
        .addIntegerOption(option => {
            return option
                .setName('id')
                .setRequired(false)
                .setDescription("Instead of a random love letter, fetch by ID")
        }),
    execute: async function (interaction: CommandInteraction) {
        const id = interaction.options.getInteger('id', false)
        let letterRaw
        let explicit = false
        if (id) {
            letterRaw = await db
                .selectFrom('ltc')
                .where('id', '=', id)
                .limit(1)
                .select(['lettermessage', 'id', 'letterpostdate', 'senderip'])
                .executeTakeFirst()
            explicit = true
        } else {
            letterRaw = await randomLetter()
        }
        const letter = turndownService.turndown(letterRaw.lettermessage)
        
        const location = (() => {
            try {
                return getLocation(IPv4.fromString(letterRaw.senderip))
            } catch(e) {
                return false
            }
        })()
        
        const message = `${letter}
${location ? `:flag_${location.toLowerCase()}: ` : ''}*<t:${Math.floor(letterRaw.letterpostdate.getTime() / 1000)}:d>* - *#${letterRaw.id}${explicit ? ' was explicitly requested' : ''}*`

        console.log(message)

        await interaction.reply(message)

    }
}