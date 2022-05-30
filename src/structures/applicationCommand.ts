import { Bot } from './Client'
import { sInteraction } from '../types/Interaction'
import { ApplicationCommandType } from 'discord.js'
export type applicationCommandOptionsType = {
    name: string
    type: ApplicationCommandType
    run?: (interaction: sInteraction) => void
}

export class applicationCommand {
    client: Bot
    name: string
    type: ApplicationCommandType
    ephemeral: boolean
    disabled: boolean

    constructor(client: Bot, options: applicationCommandOptionsType) {
        this.client = client
        this.name = options.name
        this.type = options.type
    }
}
