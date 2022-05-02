import { CacheType, Client, Interaction, InteractionReplyOptions, InteractionDeferReplyOptions, InteractionDeferUpdateOptions } from 'discord.js'
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
    reply(options: InteractionReplyOptions)
    deferReply(options: InteractionDeferReplyOptions)
    deferUpdate(options: InteractionDeferUpdateOptions)
    editReply(options: InteractionReplyOptions)
    deleteReply: any
    customId: string
    options: {
        getString(name: string)
        getMember(name: string)
        getChannel(name: string)
        getNumber(name: string)
        getSubcommand()
        getUser(name: string)
    }
}
