import {
    CacheType,
    Client,
    Interaction,
    InteractionReplyOptions,
    InteractionDeferReplyOptions,
    InteractionDeferUpdateOptions,
    CommandInteraction
} from 'discord.js'

export interface sInteraction extends CommandInteraction {
    defered: true
}

/*interface oldsInteraction extends CommandInteraction {
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
}*/
