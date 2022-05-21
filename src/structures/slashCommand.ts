import { Bot } from './Client'
import { sInteraction } from '../types/Interaction'

export type slashCommandOptionsType = {
    name: string
    description: string
    options?: Array<Object>
    ephemeral: boolean
    disabled: boolean
    run?: (interaction: sInteraction) => void
}

export class slashCommand {
    client: Bot
    name: string
    description: string
    options: Array<Object>
    ephemeral: boolean
    disabled: boolean

    constructor(client: Bot, options: slashCommandOptionsType) {
        this.client = client
        this.name = options.name
        this.description = options.description
        this.options = options.options
        this.ephemeral = options.ephemeral
        this.disabled = options.disabled
    }
}
