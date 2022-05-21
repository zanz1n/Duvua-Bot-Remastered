import { sMessage } from '../types/Message'
import { Bot } from './Client'

export type CommandOptionsType = {
    name: string
    description: string
    disabled: boolean
    aliases?: Array<string>
}

export class Command {
    client: Bot
    description: string
    name: string
    disabled: boolean
    aliases: Array<string>
    run: (message: sMessage, args: string) => void

    constructor(client: Bot, options: CommandOptionsType) {
        this.client = client
        this.name = options.name
        this.disabled = options.disabled
        this.aliases = options.aliases
        //this.run = (message: sMessage, args: string) => { }
    }
}
