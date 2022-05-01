import { Client } from 'discord.js'
import Config from '../../config'
import fs from 'fs'
import mongoose from 'mongoose'

const config = new Config()

export default class Bot extends Client {
    public commands: Array<Object>
    public slashCommands: any
    public config: Config
    public db: any

    constructor(options: any) {
        super(options)
        this.config = new Config()
        this.commands = []
        this.slashCommands = []
        this.loadSlashCommands()
        this.loadEvents()

    }
    loadSlashCommands(path = __dirname + '/../slashCommands') {
        const categories = fs.readdirSync(path)
        for (const category of categories) {
            const slashCommands = fs.readdirSync(`${path}/${category}`)

            for (const slashCommand of slashCommands) {
                const slashCommandClass = require(`${path}/${category}/${slashCommand}`)
                const scmd = new (slashCommandClass)(this)

                if (scmd.disabled) {
                } else {
                    this.slashCommands.push(scmd)
                    if (this.config.dev_mode) {
                        console.log(`\x1b[35m[bot-slashCommands] ${scmd.name} loaded\x1b[0m`)
                    }
                }
            }
        }
        console.log(`[bot-api] All slashCommands loaded`)
    }
    loadCommands(path = __dirname + '/../commands') {
        const categories = fs.readdirSync(path)
        for (const category of categories) {
            const commands = fs.readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(`${path}/${category}/${command}`)
                const cmd = new (commandClass)(this)

                this.commands.push(cmd)

                if (this.config.dev_mode) {
                    console.log(`\x1b[35m[bot-Commands] ${cmd.name} loaded\x1b[0m`)
                }
            }
        }
        console.log(`[bot-api] All Commands loaded`)
    }
    loadEvents(path = __dirname + '/../events') {
        const categories = fs.readdirSync(path)
        for (const category of categories) {
            const events = fs.readdirSync(`${path}/${category}`)

            for (const event of events) {
                const eventClass = require(`${path}/${category}/${event}`)
                const evt = new (eventClass)(this)

                this.on(evt.name, evt.run)
                if (this.config.dev_mode) {
                    console.log(`\x1b[36m[bot-events] Event ${evt.name} loaded\x1b[0m`)
                }
            }
        }
        console.log(`[bot-api] All events loaded`)
    }
    registrySlashCommands() {
        if (this.config.dev_mode) {
            console.log("\x1b[33m[bot-api] Client in dev environment\x1b[0m")
            this.guilds.cache.get(this.config.serverid).commands.set(this.slashCommands)
        } else {
            console.log("[bot-api] Client in producion environment")
            this.application.commands.set(this.slashCommands)
        }
    }
    async connectToDatabase() {
        const connection = await mongoose.connect(config.mongodb_url, {
            autoIndex: false,
            keepAlive: true
        })
        this.db = connection
    }
}
