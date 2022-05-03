import { Client } from 'discord.js'
import Config from '../../botconfig'
import fs from 'fs'
import mongoose from 'mongoose'
import { Player } from 'discord-player'
import Command from './Command'
import slashCommand from './slashCommand'

const config = new Config()

export default class Bot extends Client {
    public commands: Array<Object>
    public slashCommands: any
    public config: Config
    public db: any
    public player: Player

    constructor(options: any) {
        super(options)
        this.config = new Config()
        this.commands = []
        this.slashCommands = []
        this.loadSlashCommands()
        this.loadCommands()
        this.loadEvents()
        this.loadPlayer()

    }

    loadSlashCommands(path = __dirname + '/../slashCommands') {
        const categories = fs.readdirSync(path)
        for (const category of categories) {
            const slashCommands = fs.readdirSync(`${path}/${category}`)

            for (const slashCommand of slashCommands) {
                const slashCommandClass = require(`${path}/${category}/${slashCommand}`)
                const scmd: slashCommand = new (slashCommandClass)(this)

                if (scmd.disabled) {
                    console.log(`\x1b[31m[bot-slashCommands] ${scmd.name} disabled\x1b[0m`)
                } else {
                    this.slashCommands.push(scmd)

                    if (this.config.dev_mode) {
                        console.log(`\x1b[35m[bot-slashCommands] ${scmd.name} loaded\x1b[0m`)
                    }
                }
            }
        }
        console.log(`\x1b[33m[bot-api] All slashCommands loaded\x1b[0m`)
    }
    loadCommands(path = __dirname + '/../commands') {
        const categories = fs.readdirSync(path)
        for (const category of categories) {
            const commands = fs.readdirSync(`${path}/${category}`)

            for (const slashCommand of commands) {
                const commandClass = require(`${path}/${category}/${slashCommand}`)
                const cmd: Command = new (commandClass)(this)

                if (cmd.disabled) {
                    console.log(`\x1b[31m[bot-legacyCommands] ${cmd.name} disabled\x1b[0m`)
                } else {
                    this.commands.push(cmd)

                    if (this.config.dev_mode) {
                        console.log(`\x1b[34m[bot-legacyCommands] ${cmd.name} loaded\x1b[0m`)
                    }
                }
            }
        }
        console.log(`\x1b[33m[bot-api] All legacyCommands loaded\x1b[0m`)
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
        console.log(`\x1b[33m[bot-api] All events loaded\x1b[0m`)
    }
    registrySlashCommands() {
        if (this.config.dev_mode) {
            console.log("\x1b[33m[bot-api] Client in dev environment\x1b[0m")
            this.guilds.cache.get(this.config.serverid).commands.set(this.slashCommands)
        } else {
            console.log("\x1b[31m[bot-api] Client in producion environment\x1b[0m")
            this.application.commands.set(this.slashCommands)
        }
    }
    loadPlayer() {
        this.player = new Player(this, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }
        })
        console.log("\x1b[32m[bot-player] connected to the Player\x1b[0m")
    }
    async connectToDatabase() {
        const connection = await mongoose.connect(config.mongodb_url, {
            autoIndex: false,
            keepAlive: true
        })
        this.db = connection
    }
}
