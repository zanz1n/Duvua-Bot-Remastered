import { Bot } from './Client'
import { sMessage } from '../types/Message'

export type CommandOptionsType = {
    name: string
    description: string
    disabled: boolean
    aliases?: Array<string>
    run?: (message: sMessage, args: string) => void
}

export class Command {
    client: Bot
    description: string
    name: string
    disabled: boolean
    aliases: Array<string>

    constructor(client: Bot, options: CommandOptionsType) {
        this.client = client
        this.name = options.name
        this.disabled = options.disabled
        this.aliases = options.aliases
        //this.run = (message: sMessage, args: string) => { }
    }
}
