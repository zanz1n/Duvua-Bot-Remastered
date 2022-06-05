import {
    CacheType,
    Client,
    Interaction,
    InteractionReplyOptions,
    InteractionDeferReplyOptions,
    InteractionDeferUpdateOptions
} from 'discord.js'

export interface sInteraction extends Interaction {
    reply: (options: InteractionReplyOptions) => void
    deferReply: (options: InteractionDeferReplyOptions) => void
    deferUpdate: (options: InteractionDeferUpdateOptions) => void
    editReply: (options: InteractionReplyOptions) => void
    deleteReply: any
    customId: string
    options: {
        getString(name: string)
        getMember(name: string)
        getChannel(name: string)
        getNumber(name: string)
        getSubcommand: () => string
        getSubcommandGroup: () => string
        getUser(name: string)
    }
}
