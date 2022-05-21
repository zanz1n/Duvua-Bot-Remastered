import { Bot } from '../../structures/Client'
import { Command } from '../../structures/Command'
import { sMessage } from '../../types/Message'
import { Embed as MessageEmbed } from '../../types/Embed'

module.exports = class extends Command {
    constructor(client: Bot) {
        super(client, {
            name: "resources",
            description: "Exibe infos tecnicas do bot",
            disabled: false,
            aliases: ['res'],
        })
    }
    run = async (message: sMessage) => {
        if (message.author.id !== "586600481959182357") return
        else {
            function interGer(n: number) {
                return n - n % 1
            }
            message.reply({ content: `${interGer(process.memoryUsage().heapTotal / 1024 ** 2) + "/" + interGer(process.memoryUsage().rss / 1024 ** 2)} MB` })
        }
    }
}
