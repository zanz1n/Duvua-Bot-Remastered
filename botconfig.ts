import { ColorResolvable, Intents } from "discord.js"
import 'dotenv/config'

const {
    BOT_TOKEN,
    SERVER_ID,
    MONGODB_URL,
    GOOGLE_MAPS_API_KEY,
    LAVALINK_PASSWORD,
    LAVALINK_HOST
} = process.env

class Config {
    public token = BOT_TOKEN
    public serverid = SERVER_ID
    public name = "Duvua Bot"
    public embed_default_color: ColorResolvable = "#ff21f4"
    public prefix = "-"
    public dev_mode = false
    public mongodb_url = MONGODB_URL
    public maps_api_key = GOOGLE_MAPS_API_KEY
    public lavalink_password = LAVALINK_PASSWORD
    public lavalink_host = LAVALINK_HOST
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
        all_events_loaded: "\x1b[33m[client] All events loaded\x1b[0m",
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
        lavalink_logs(name: String) {
            return `\x1b[33m[lavalink-info] ${name}\x1b[0m`
        },
        lavalink_err(name: String) {
            return `\x1b[31m[lavalink-err] ${name}\x1b[0m`
        },
        single_application_command(name: string) {
            return `\x1b[35m[bot-applicationCommands] ${name} loaded\x1b[0m`
        },
    }
}

export const config = new Config

export {
    Config,
}
