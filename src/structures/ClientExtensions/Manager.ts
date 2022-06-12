import { Manager, ManagerOptions } from "erela.js";
import { Bot } from "../Client";

const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

export class LavalinkManager extends Manager {
    constructor(client: Bot) {
        super({
            nodes: [{
                host: client.config.lavalink_host,
                password: client.config.lavalink_password,
                retryDelay: 5000,
            }],
            autoPlay: true,
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        })

        this.on("nodeConnect", async (node) => {
            console.log(
                client.config.logs.lavalink_logs(`Node "${node.options.identifier}" connected`)
            )
        })

        this.on("nodeError", async (node, error) => {
            console.log(
                client.config.logs.lavalink_err(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
            )
        })

        this.on("queueEnd", async (player) => {
            await sleep(500).then(() => {
                player.destroy()
            })
        })
    }
}
