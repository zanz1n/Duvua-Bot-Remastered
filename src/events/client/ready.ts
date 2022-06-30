import { Event } from '../../structures/Event'
import { Bot } from '../../structures/Client'
import { logger } from '../../logger'

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "ready"
        })
    }
    run = async () => {
        await this.client.user.setUsername(this.client.config.name)
        this.client.user.setActivity(`use /help`)
        this.client.registrySlashCommands()

        await this.client.db.connectToDatabase()

        await this.client.manager.init(this.client.user.id)

        function interGer(n: number) {
            return n - n % 1
        }
        function cl(str: string) {
            return "\x1b[33m" + str + "\x1b[0m"
        }

        logger.log("log", `${this.client.user.tag} ${cl("|")} ${this.client.guilds.cache.size} guild(s) ${cl("|")} ${this.client.config.dev_mode ? "development" : "production"} ${cl("|")} ` +
            `${interGer(process.memoryUsage().heapTotal / 1024 ** 2) + "/" + interGer(process.memoryUsage().rss / 1024 ** 2)} MB`)
    }
}
