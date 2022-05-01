import { CacheType, Client, Interaction, Permissions, ThreadMember } from 'discord.js'
import Bot from '../structures/Client'

class slashCommand {
    client: Bot
    name: string
    description: string
    options: Array<Object>
    ephemeral: boolean
    disabled: boolean

    constructor(client: Bot, options: any) {
        this.client = client
        this.name = options.name
        this.description = options.description
        this.options = options.options
        this.ephemeral = options.ephemeral
        this.disabled = options.disabled
    }
}

export default slashCommand

export interface sInteraction extends Interaction {
    reply: any
    editReply: any
    ticket: {
        db: any
    }
    customId: string
    options: {
        getString(name: string)
        getMember(name: string)
        getChannel(name: string)
        getSubcommand()
        getUser(name: string)
    }
}
