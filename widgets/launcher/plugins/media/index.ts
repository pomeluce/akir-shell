import Mpris from "gi://AstalMpris"
import { Variable } from "astal"
import type { Plugin } from "../plugin"
import Media from "./Media"

export default function media(): Plugin {
    const mpris = Mpris.get_default()
    const filter = Variable("")

    return {
        icon: "emblem-music",
        description: "Control media players",
        ui: Media(filter),
        search(search: string) {
            filter.set(search)
        },
        enter(entered: string) {
            const player = mpris.get_players().find(p => {
                const filter = entered.toLowerCase()
                const entry = p.entry?.toLowerCase() ?? ""
                const id = p.identity?.toLowerCase() ?? ""
                return entry.includes(filter) || id.includes(filter)
            })

            if (player)
                player.play_pause()
        },
    }
}
