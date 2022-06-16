import { Bot } from './Client'
import {
    ChatInputApplicationCommandData,
    ApplicationCommandOptionData
} from 'discord.js'

export type slashCommandType = {
    ephemeral: boolean
    disabled: boolean

} & ChatInputApplicationCommandData

export abstract class slashCommand {
    client: Bot
    name: string
    description: string
    options: ApplicationCommandOptionData[]
    ephemeral: boolean
    disabled: boolean
    constructor(client: Bot, options: slashCommandType) {
        this.client = client
        this.name = options.name
        this.description = options.description
        this.options = options.options
        this.ephemeral = options.ephemeral
        this.disabled = options.disabled
    }
}
