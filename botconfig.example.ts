import { ColorResolvable } from "discord.js"
import 'dotenv/config'

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
        this.token = process.env.BOT_TOKEN
        this.serverid = process.env.SERVER_ID
        this.name = "Bot" //This name is no long permited
        this.embed_default_color = "#0000FF"
        this.prefix = "-"
        this.dev_mode = true
        this.log_all_loads = false
        this.cost = "R$: 10,99"
        this.mongodb_url = process.env.MONGODB_URL
    }
}
