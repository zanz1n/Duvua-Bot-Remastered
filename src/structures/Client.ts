import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { Command } from './Command'
import { config } from '../../botconfig'
import { Database } from '../database'
import { LavalinkManager } from './ClientExtensions/Manager'

const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

export class Bot extends Client {
    public db = new Database
    public commands = []
    public slashCommands = []
    public config = config

    public manager = new LavalinkManager(this)

    public start() {
        this.login(this.config.token).catch((err) => {
            console.log(err)
            process.exit(1)
        })
        this.loadSlashCommands()
        this.loadCommands()
        this.loadEvents()
        this.loadApplicationCommands()
    }

    public constructor() {
        super(config.client_init_options)
    }

    private loadSlashCommands(path = __dirname + '/../slashCommands') {
        for (const category of readdirSync(path)) {

            for (const slashCommand of readdirSync(`${path}/${category}`)) {

                const scmd = new (require(`${path}/${category}/${slashCommand}`))(this)

                if (scmd.disabled) console.log(config.logs.disabled_slash_command(scmd.name))
                else {
                    this.slashCommands.push(scmd)
                    if (this.config.dev_mode) console.log(config.logs.single_slash_command(scmd.name))
                }
            }
        } console.log(`\x1b[33m[bot-api] All slashCommands loaded\x1b[0m`)
    }

    private loadCommands(path = __dirname + '/../commands') {
        for (const category of readdirSync(path)) {

            for (const command of readdirSync(`${path}/${category}`)) {

                const cmd: Command = new (require(`${path}/${category}/${command}`))(this)

                if (cmd.disabled) console.log(config.logs.disabled_command(cmd.name))
                else {
                    this.commands.push(cmd)
                    if (this.config.dev_mode) console.log(config.logs.single_command(cmd.name))
                }
            }
        } console.log(`\x1b[33m[bot-api] All legacyCommands loaded\x1b[0m`)
    }

    private loadEvents(path = __dirname + '/../events') {
        for (const category of readdirSync(path)) {

            for (const event of readdirSync(`${path}/${category}`)) {

                const evt: any = new (require(`${path}/${category}/${event}`))(this)

                if (this.config.dev_mode) console.log(this.config.logs.single_event(evt.name))
                this.on(evt.name, evt.run)
            }
        } console.log(`\x1b[33m[bot-api] All Events loaded\x1b[0m`)
    }

    private loadApplicationCommands(path = __dirname + '/../applicationCommands') {
        for (const category of readdirSync(path)) {

            for (const applicationCommand of readdirSync(`${path}/${category}`)) {

                const scmd = new (require(`${path}/${category}/${applicationCommand}`))(this)

                if (scmd.disabled) console.log(config.logs.disabled_slash_command(scmd.name))
                else {
                    this.slashCommands.push(scmd)
                    if (this.config.dev_mode) console.log(config.logs.single_application_command(scmd.name))
                }
            }
        } console.log(`\x1b[33m[bot-api] All applicationCommands loaded\x1b[0m`)
    }

    public parseMsIntoFormatData(n: string | Number) {
        function interGer(n: number) {
            return n - n % 1
        }
        const timeOut = Number(n)
        const hour = interGer(timeOut / 3600000)
        const minutes = interGer(timeOut / 60000 - hour * 60)
        const seconds = interGer(timeOut / 1000 - minutes * 60 - hour * 3600)

        let formatData: string

        if (hour != 0) {
            formatData = `${hour}h:${minutes}m:${seconds}s`
        } if (hour == 0 || !hour) {
            formatData = `${minutes}m:${seconds}s`
        } if (minutes == 0) {
            formatData = `${seconds}s`
        }
        return formatData
    }

    public registrySlashCommands() {
        if (this.config.dev_mode)
            this.guilds.cache.get(this.config.serverid).commands
                .set(this.slashCommands)
        else this.application.commands
            .set(this.slashCommands)
    }
}
