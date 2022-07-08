import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { sql } from 'kysely'
import { db } from '../../../shared.js'
import TurndownService from 'turndown'

const turndownService = new TurndownService()

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
    execute: async function(interaction: CommandInteraction) {
        const id = interaction.options.getInteger('id',false)
        let letterRaw
        let explicit = false
        if (id) {
            letterRaw = await db
                .selectFrom('ltc')
                .where('id','=',id)
                .limit(1)
                .select(['lettermessage','id','letterpostdate','senderip'])
                .executeTakeFirst()
            explicit = true
        } else{ 
            letterRaw = await db
                .selectFrom('ltc')
                .orderBy(sql`random()`,'asc')
                .limit(1)
                .select(['lettermessage','id','letterpostdate','senderip'])
                .executeTakeFirst()
        }
        const letter = turndownService.turndown(letterRaw.lettermessage)
        
        const message = `${letter}
*${letterRaw.letterpostdate.toLocaleDateString('en-US')}* - *#${letterRaw.id}${explicit ? ' was explicitly requested' : ''}*`
        
        console.log(message)
            
        await interaction.reply(message)
        
    }
}