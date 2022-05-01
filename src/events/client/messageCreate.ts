import Event from "../../structures/Event"
import Bot from "../../structures/Client"
import { Message } from 'discord.js'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "messageCreate"
        })
    }
    run = async (message: Message) => {
        if (message.author.bot) return
        
        if (this.client.config.dev_mode) console.log(`\x1b[36m[bot-events] Message created\x1b[0m`)

        if (message.content === `<@${this.client.user.id}>`) {
            message.reply("Pong")
        }
    }
}
