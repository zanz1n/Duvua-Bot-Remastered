import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { Command } from './Command'
import { config } from '../../botconfig'
import { Database } from '../database'
import { LavalinkManager } from './ClientExtensions/Manager'
import { logger } from '../logger'
import { slashCommand } from './slashCommand'

const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

export class Bot extends Client {
    public db = new Database
    public commands = []
    public slashCommands = []
    public config = config

    public manager = new LavalinkManager(this)

    public start() {
        this.login(this.config.token).catch((err) => {
            logger.log("error", err)
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

                const scmd: slashCommand =
                    new (require(`${path}/${category}/${slashCommand}`))(this)

                if (scmd.disabled) return logger.log("warn", `slashCommand ${scmd.name} disabled`)

                this.slashCommands.push(scmd)
                logger.log("debug", `slashCommand ${scmd.name} loaded`)
            }
        } logger.log("info", `all slashCommands loaded`)
    }

    private loadCommands(path = __dirname + '/../commands') {
        for (const category of readdirSync(path)) {

            for (const command of readdirSync(`${path}/${category}`)) {

                const cmd: Command =
                    new (require(`${path}/${category}/${command}`))(this)

                if (cmd.disabled) return logger.log("warn", `legacyCommand ${cmd.name} disabled`)

                this.commands.push(cmd)
                logger.log("debug", `legacyCommand ${cmd.name} loaded`)
            }
        } logger.log("info", `all legacyCommands loaded`)
    }

    private loadEvents(path = __dirname + '/../events') {
        for (const category of readdirSync(path)) {

            for (const event of readdirSync(`${path}/${category}`)) {

                const evt: any = new (require(`${path}/${category}/${event}`))(this)

                logger.log("debug", `event ${evt.name} loaded`)
                this.on(evt.name, evt.run)
            }
        } logger.log("info", `all Events loaded`)
    }

    private loadApplicationCommands(path = __dirname + '/../applicationCommands') {
        for (const category of readdirSync(path)) {

            for (const applicationCommand of readdirSync(`${path}/${category}`)) {

                const scmd = new (require(`${path}/${category}/${applicationCommand}`))(this)

                if (scmd.disabled) logger.log("warn", `applicationCommand ${scmd.name} loaded`)
                else {
                    this.slashCommands.push(scmd)
                    if (this.config.dev_mode) logger.log("debug", `applicationCommand ${scmd.name} loaded`)
                }
            }
        } logger.log("info", `all applicationCommands loaded`)
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
