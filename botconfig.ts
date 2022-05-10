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
        this.token = "OTYwMzcwMTA5MDY1NTkyOTAy.YkpcXA.Ga0Jw2Zt7LbyFSdMN3ImAtzjq18"
        this.serverid = "951236777560129627"
        this.name = "Oyne Bot"
        this.embed_default_color = "#0000FF"
        this.log_all_loads = true
        this.prefix = "-"
        this.dev_mode = true
        this.cost = "R$: 10,99"
        this.mongodb_url = "mongodb://duvuatest:Gankaku77@192.168.15.20:27017/test-dc-duvua-bot?authMechanism=DEFAULT&authSource=test-dc-duvua-bot"
    }
}
