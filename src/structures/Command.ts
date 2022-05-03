import {
    Client,
    InteractionDeferReplyOptions,
    InteractionDeferUpdateOptions,
    InteractionReplyOptions,
    Message
} from 'discord.js'
import Bot from '../structures/Client'

export interface sMessage extends Message {
    reply(options: InteractionReplyOptions)
    //deferReply(options: InteractionDeferReplyOptions)
    //deferUpdate(options: InteractionDeferUpdateOptions)
    editReply(options: InteractionReplyOptions)
    deferReply(content: InteractionReplyOptions)
    deleteReply: any
}

class Command {
    client: Bot
    name: string
    disabled: boolean
    aliases: Array<string>
    run: (message: sMessage, args: string) => void

    constructor(client: Bot, options: any) {
        this.client = client
        this.name = options.name
        this.disabled = options.disabled
        this.aliases = options.aliases
        //this.run = (message: sMessage, args: string) => { }
    }
}
export default Command
