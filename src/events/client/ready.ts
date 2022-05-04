import Event from '../../structures/Event'
import Bot from '../../structures/Client'

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

        await this.client.connectToDatabase().then(() => {
            console.log("\x1b[32m[mongoose-db] connected to the database \x1b[0m")
        }).catch((err) => {
            console.log("\x1b[31m[bot-err] Failed to connect to databse\x1b[0m")
            process.exit(1)
        })
        function interGer(n: number) {
            return n - n % 1
        }
        function yellow(str: string) {
            return "\x1b[33m" + str + "\x1b[0m"
        }

        console.log(`${yellow("[bot-api]")} ${this.client.user.tag} ${yellow("|")} ${this.client.guilds.cache.size} guild(s) ${yellow("|")} ${this.client.config.dev_mode ? "development" : "production"} ${yellow("|")} ` +
            `${interGer(process.memoryUsage().heapTotal / 1024 ** 2) + "/" + interGer(process.memoryUsage().rss / 1024 ** 2)} MB`)
    }
}
