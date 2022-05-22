import { ColorResolvable, Intents } from "discord.js"
import 'dotenv/config'

const {
    BOT_TOKEN,
    SERVER_ID,
    MONGODB_URL,
    GOOGLE_MAPS_API_KEY
} = process.env

class Config {
    public token = BOT_TOKEN
    public serverid = SERVER_ID
    public name = "Oyne Bot"
    public embed_default_color: ColorResolvable = "#0000FF"
    public prefix = "-"
    public dev_mode = true
    public mongodb_url = MONGODB_URL
    public maps_api_key = GOOGLE_MAPS_API_KEY
    public cost = "R$: 10,99"
    public client_init_options = {
        intents: [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    }

    public logs = {
        bot(content: string) {
            return `\x1b[33m[client] ${content}\x1b[0m`
        },
        bot_error(content: string) {
            return `\x1b[31m[bot] ${content}\x1b[0m`
        },
        single_event(name: string) {
            return `\x1b[36m[bot-events] Event ${name} loaded\x1b[0m`
        },
        all_events_loaded: "\x1b[33m[bot-api] All events loaded\x1b[0m",
        single_slash_command(name: string) {
            return `\x1b[35m[bot-slashCommands] ${name} loaded\x1b[0m`
        },
        disabled_slash_command(name: string) {
            return `\x1b[31m[bot-slashCommands] ${name} disabled\x1b[0m`
        },
        single_command(name: string) {
            return `\x1b[34m[bot-legacyCommands] ${name} loaded\x1b[0m`
        },
        disabled_command(name: string) {
            return `\x1b[31m[bot-legacyCommands] ${name} disabled\x1b[0m`
        },
    }
}

const config = new Config

export {
    Config,
    config
}
