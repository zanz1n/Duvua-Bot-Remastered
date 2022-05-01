import { Client, Message } from 'discord.js'
import Bot from '../structures/Client'

class Command {
    client: Bot
    name: string
    disabled: boolean

    constructor(client: Bot, options:any) {
        this.client = client
        this.name = options.name
        this.disabled = options.disabled
    }
}

export default Command

/*export class sInteraction extends Interaction {
    reply: any
    editReply: any
    options: {
        getString(name: string)
        getMember(name: string)
    }
}*/
