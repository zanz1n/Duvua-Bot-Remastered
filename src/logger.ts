import debug from "debug"
import { config } from "../botconfig"

type logTypes =
    "debug"
    | "info"
    | "warn"
    | "error"
    | "log"

export const colors = new (class {
    public black = (string: String) => {
        return `\x1b[40m${string}\x1b[0m`
    }
    public red = (string: String) => {
        return `\x1b[41m${string}\x1b[0m`
    }
    public green = (string: String) => {
        return `\x1b[42m${string}\x1b[0m`
    }
    public yellow = (string: String) => {
        return `\x1b[43m${string}\x1b[0m`
    }
    public blue = (string: String) => {
        return `\x1b[44m${string}\x1b[0m`
    }
    public magenta = (string: String) => {
        return `\x1b[45m${string}\x1b[0m`
    }
    public cyan = (string: String) => {
        return `\x1b[46m${string}\x1b[0m`
    }
    public white = (string: String) => {
        return `\x1b[47m${string}\x1b[0m`
    }
})


export const logger = new (class {
    private _debug = debug("bot:debug")
    private _info = debug("bot:info")
    private _warn = debug("bot:warn")
    private _error = debug("bot:error")
    private _log = debug("bot:log")
    public log(type: logTypes, msg: String) {
        //const date = new Date().toISOString()

        switch (type) {
            case "debug":
                if (!config.dev_mode) return
                this._debug(colors.green("DEBUG") + ` ${msg}`)
                break
            case "info":
                if (!config.dev_mode) return
                this._info(colors.blue("INFO") + ` ${msg}`)
                break
            case "warn": this._warn(colors.yellow("WARN") + ` ${msg}`); break
            case "error": this._error(colors.red("ERROR") + ` ${msg}`); break
            case "log": this._log(colors.white("LOG") + ` ${msg}`); break
        }
    }
})
