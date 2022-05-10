import { ColorResolvable } from "discord.js"

export default class Config {
    token: string
    serverid: string
    name: string
    embed_default_color: ColorResolvable
    prefix: string
    dev_mode: boolean
    mongodb_url: string
    cost: string
    log_all_loads: boolean

    constructor() {
        this.token = ""
        this.serverid = ""
        this.name = "Bot"
        this.embed_default_color = "#0000FF"
        this.prefix = "-"
        this.dev_mode = true
        this.log_all_loads = false
        this.cost = "R$: 10,99"
        this.mongodb_url = "mongodb://localhost:27017/test"
    }
}
