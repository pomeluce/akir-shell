import { Plugin } from "../plugin"
import { GLib, Variable } from "astal"
import CalendarUI from "./CalendarUI"
import CalendarIcon from "./CalendarIcon"

export type Date = Variable<{ day: number, month: number, year: number }>

export default function calendar(): Plugin {
    const [year, month, day] = GLib.DateTime.new_now_local().get_ymd()
    const date: Date = Variable({ day, month, year })

    return {
        icon: CalendarIcon(date),
        ui: CalendarUI(date),
        description: "Calendar and events",
        reload() {
            const [year, month, day] = GLib.DateTime.new_now_local().get_ymd()
            date.set({ year, month, day })
        },
        search(search) {
            print(search)
        },
        enter(entered) {
            print(entered)
        },
    }
}
