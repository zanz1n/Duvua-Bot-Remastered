import Event from '../../structures/Event'
import Bot from '../../structures/Client'
import Config from '../../../config'
const config = new Config()

module.exports = class extends Event {
    constructor(client: Bot) {
        super(client, {
            name: "ready"
        })
    }
    run = async () => {
        this.client.user.setActivity(`use /help`)
        this.client.registrySlashCommands()

        await this.client.connectToDatabase().then(() => {
            console.log("\x1b[32m[mongoose-db] connected to the database \x1b[0m")
        }).catch((err) => {
            console.log("\x1b[31m[bot-err] Failed to connect to databse\x1b[0m")
            process.exit(1)
        })

        console.log(`[bot-api] logged to discord-api as ${this.client.user.tag} in ${this.client.guilds.cache.size} guild(s)`)
    }
}
