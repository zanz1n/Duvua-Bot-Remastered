console.log(`\x1b[33m[bot-api] Starting [...]\x1b[0m`)

import Bot from './structures/Client'
import { Intents } from 'discord.js'
import 'discord-player/smoothVolume'

const client = new Bot({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    partials: ['MESSAGE', 'REACTION']
})

client.login(client.config.token).catch((err: Error) => {
    throw new Error(`\x1b[31m The token provided is not valid.\x1b[0m
        \x1b[33mPlease edit the config.ts file and provide a valid one.\x1b[0m\n`)
})
